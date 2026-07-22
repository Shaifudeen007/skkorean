import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageCircle, 
  CheckCircle2, 
  Check, 
  Zap, 
  FileText, 
  Sparkles, 
  ListOrdered, 
  Shield 
} from 'lucide-react';
import api, { getImageUrl } from '../services/api';
import type { Product } from '../types/product';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product || data);
      } catch (error) {
        // Handled silently
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center text-foreground font-semibold">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold mb-4 text-foreground">Product Not Found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>
    );
  }

  const handleWhatsAppEnquiry = () => {
    const message = `Hello SK Korean Aesthetic Technologies! I am interested in exploring pricing and details for ${product.name}.\n\nPlease provide me with more information.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918610345830?text=${encodedMessage}`, '_blank');
  };

  const keyFeaturesList = product.keyFeatures 
    ? product.keyFeatures.split('\n').map(line => line.trim().replace(/^[•\-\*]\s*/, '')).filter(Boolean)
    : [];

  const whyChooseUsList = product.whyChooseUs 
    ? product.whyChooseUs.split('\n').map(line => line.trim().replace(/^[✓\-\*]\s*/, '')).filter(Boolean)
    : [];

  const procedureList = product.procedure 
    ? product.procedure.split('\n').map(line => line.trim().replace(/^\d+[\.\)]\s*/, '')).filter(Boolean)
    : [];

  const categoryName = typeof product.category === 'object' && product.category !== null
    ? product.category.name
    : (product.category || 'Uncategorized');

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-8 group"
        >
          <div className="p-2 rounded-full bg-border/50 group-hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Products</span>
        </button>

        {/* Top Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-16">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-[4/5] rounded-3xl overflow-hidden bg-primary/5 border border-border/50 shadow-2xl lg:sticky lg:top-32"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10 pointer-events-none" />
            <img 
              src={product.image ? getImageUrl(product.image) : "https://via.placeholder.com/600x600?text=No+Image"} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-3xl mix-blend-screen"
            />
          </motion.div>

          {/* Product Basic Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col space-y-6"
          >
            <div>
              <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="w-4 h-4" /> {categoryName}
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-foreground">
                {product.name}
              </h1>
            </div>
            
            {(product.discountPrice || product.mrp || product.price) && (
              <div className="flex items-center gap-4">
                {(product.mrp || product.originalPrice) && (
                  <span className="text-xl sm:text-2xl text-foreground/50 line-through font-outfit">
                    ₹{product.mrp || product.originalPrice}
                  </span>
                )}
                {(product.discountPrice || product.price) && (
                  <span className="text-3xl sm:text-4xl font-outfit font-bold text-primary">
                    ₹{product.discountPrice || product.price}
                  </span>
                )}
              </div>
            )}

            {/* Quick Enquire CTA */}
            <div className="pt-2">
              <button 
                onClick={handleWhatsAppEnquiry}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enquire via WhatsApp</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Detailed Professional Sections Stack */}
        <div className="space-y-8 max-w-5xl mx-auto">

          {/* 1. Description Section */}
          {product.description && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border/60 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold font-serif text-foreground mb-4 flex items-center gap-3 pb-3 border-b border-border/40">
                <FileText className="w-6 h-6 text-primary shrink-0" />
                <span>Description</span>
              </h2>
              <div className="text-base sm:text-lg text-foreground/80 leading-relaxed space-y-3">
                {product.description.split('\n').filter(line => line.trim() !== '').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          )}

          {/* 2. Key Features Section */}
          {keyFeaturesList.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border/60 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold font-serif text-foreground mb-6 flex items-center gap-3 pb-3 border-b border-border/40">
                <Sparkles className="w-6 h-6 text-primary shrink-0" />
                <span>Key Features</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {keyFeaturesList.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/40 hover:border-primary/30 transition-all group"
                  >
                    <span className="text-primary font-bold text-xl leading-none mt-0.5 group-hover:scale-125 transition-transform shrink-0">•</span>
                    <span className="text-foreground/90 font-medium text-base sm:text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3. Why Choose Us Section */}
          {whyChooseUsList.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border/60 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold font-serif text-foreground mb-6 flex items-center gap-3 pb-3 border-b border-border/40">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                <span>Why Choose Us</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {whyChooseUsList.map((reason, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3.5 p-4 rounded-xl bg-background/50 border border-border/40 hover:border-primary/30 transition-all group"
                  >
                    <div className="p-1 rounded-full bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                    </div>
                    <span className="text-foreground/90 font-medium text-base sm:text-lg">{reason}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 4. Procedure Section */}
          {procedureList.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border/60 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold font-serif text-foreground mb-6 flex items-center gap-3 pb-3 border-b border-border/40">
                <ListOrdered className="w-6 h-6 text-primary shrink-0" />
                <span>Procedure</span>
              </h2>
              <div className="space-y-4">
                {procedureList.map((step, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/40 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0 shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <span className="text-foreground/90 font-medium text-base sm:text-lg pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Fallback for products with legacy longDescription when new fields are empty */}
          {(!product.keyFeatures && !product.whyChooseUs && !product.procedure && product.longDescription) && (
            <div className="space-y-6">
              {product.longDescription.keyBenefits && product.longDescription.keyBenefits.length > 0 && (
                <div className="bg-card border border-border/60 rounded-xl p-6 sm:p-8 shadow-md">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground"><CheckCircle2 className="w-5 h-5 text-primary" /> Key Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.longDescription.keyBenefits.map((benefit: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 rounded-full bg-background border border-border/50 text-sm text-foreground/90">{benefit}</span>
                    ))}
                  </div>
                </div>
              )}

              {product.longDescription.specifications && product.longDescription.specifications.length > 0 && (
                <div className="bg-card border border-border/60 rounded-xl p-6 sm:p-8 shadow-md">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground"><Shield className="w-5 h-5 text-primary" /> Technical Specifications</h3>
                  <div className="rounded-xl overflow-hidden border border-border/50 bg-background/50">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-border/50">
                        {product.longDescription.specifications.map((spec: any, idx: number) => (
                          <tr key={idx} className="hover:bg-primary/5 transition-colors">
                            <th className="px-4 py-3 font-semibold text-foreground/90 w-1/3 bg-card">{spec.label}</th>
                            <td className="px-4 py-3 text-foreground/70">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
