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
  Shield,
  Award,
  Clock,
  Sparkle
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
        <div className="flex items-center gap-3 bg-card/80 px-6 py-4 rounded-full border border-border shadow-xl backdrop-blur-md">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading product details...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
          <Zap className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-foreground">Product Not Found</h2>
        <p className="text-foreground/60 mb-6 max-w-sm">The product you are looking for does not exist or has been removed.</p>
        <button 
          onClick={() => navigate('/#products')}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Catalog
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
    <div className="pt-24 pb-20 min-h-screen relative overflow-hidden">
      {/* Background Decorative Ambient Lighting */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2.5 text-foreground/70 hover:text-primary transition-all group font-medium text-sm sm:text-base"
          >
            <div className="p-2 rounded-full bg-card border border-border/60 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span>Back to Machinery Catalog</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border/60 text-xs font-semibold text-foreground/70 shadow-sm">
            <Award className="w-3.5 h-3.5 text-primary" /> Authentic Korean Aesthetic Tech
          </span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-14">
          
          {/* Image Showcase Panel (5 Cols on Desktop) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative group"
          >
            <div className="relative w-full min-h-[340px] sm:min-h-[400px] lg:max-h-[460px] aspect-square rounded-[1.5rem] overflow-hidden bg-gradient-to-b from-card to-background border border-border/70 shadow-2xl flex items-center justify-center p-3 sm:p-4">
              
              {/* Studio Glow Ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-primary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <img 
                src={product.image ? getImageUrl(product.image) : "https://via.placeholder.com/600x600?text=No+Image"} 
                alt={product.name} 
                className="w-full h-full max-h-[320px] sm:max-h-[380px] object-contain dark:mix-blend-screen group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Floating Quality Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-card/90 backdrop-blur-md border border-border/60 rounded-2xl px-4 py-2.5 shadow-lg pointer-events-none">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Sparkle className="w-3.5 h-3.5 text-primary fill-primary" /> Premium Clinical Grade
                </span>
                <span className="text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  SK Certified
                </span>
              </div>
            </div>
          </motion.div>

          {/* Product Header & Action Panel (7 Cols on Desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col justify-between bg-card/60 backdrop-blur-xl border border-border/70 rounded-[1.5rem] p-6 sm:p-8 shadow-xl relative"
          >
            <div>
              {/* Category Pill */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/15 text-primary text-xs sm:text-sm font-bold tracking-wide border border-primary/20">
                  <Zap className="w-3.5 h-3.5 fill-primary" /> {categoryName}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-foreground leading-tight mb-4">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-border/50">
                {(product.discountPrice || product.price) ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-outfit font-extrabold text-primary">
                      ₹{product.discountPrice || product.price}
                    </span>
                    {(product.mrp || product.originalPrice) && (
                      <span className="text-lg sm:text-xl text-foreground/40 line-through font-outfit">
                        ₹{product.mrp || product.originalPrice}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xl sm:text-2xl font-outfit font-bold text-primary tracking-wider uppercase bg-primary/10 px-4 py-1.5 rounded-xl border border-primary/20">
                    Enquire for Price & Demo
                  </span>
                )}
              </div>

              {/* High Level Quick Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Warranty</span>
                    <span className="text-[11px] text-foreground/60">Full Tech Support</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Safety</span>
                    <span className="text-[11px] text-foreground/60">Clinical Precision</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-background/50 border border-border/50 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Delivery</span>
                    <span className="text-[11px] text-foreground/60">Pan India Shipping</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={handleWhatsAppEnquiry}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-all shadow-xl shadow-[#25D366]/25 hover:shadow-[#25D366]/40 hover:-translate-y-0.5 active:translate-y-0 text-base"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Enquire via WhatsApp</span>
              </button>
            </div>

          </motion.div>
        </div>

        {/* Detailed Content Sections (No Cards, Clean Headings & Direct Content) */}
        <div className="space-y-12 max-w-5xl mx-auto">
            
          {/* 1. Description */}
          {product.description && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary shrink-0" />
                <span>Description</span>
              </h2>
              <div className="text-base sm:text-lg text-foreground/80 leading-relaxed space-y-3 pl-1">
                {product.description.split('\n').filter(line => line.trim() !== '').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          )}

          {/* 2. Key Features */}
          {keyFeaturesList.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary shrink-0" />
                <span>Key Features</span>
              </h2>
              <div className="space-y-3 pl-1">
                {keyFeaturesList.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-primary font-bold text-xl leading-none mt-0.5">•</span>
                    <span className="text-foreground/90 font-medium text-base sm:text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3. Procedure */}
          {procedureList.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-3">
                <ListOrdered className="w-6 h-6 text-primary shrink-0" />
                <span>Procedure</span>
              </h2>
              <div className="space-y-3 pl-1">
                {procedureList.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="font-bold text-primary text-base sm:text-lg min-w-[24px]">
                      {index + 1}.
                    </span>
                    <span className="text-foreground/90 font-medium text-base sm:text-lg">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 4. Why Choose This ? */}
          {whyChooseUsList.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground border-b border-border/50 pb-3 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                <span>Why Choose This ?</span>
              </h2>
              <div className="space-y-3 pl-1">
                {whyChooseUsList.map((reason, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-1 stroke-[2.5]" />
                    <span className="text-foreground/90 font-medium text-base sm:text-lg">{reason}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
