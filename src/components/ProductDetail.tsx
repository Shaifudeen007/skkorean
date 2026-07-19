import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, CheckCircle2, Shield, Settings, Zap } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>
    );
  }

  const handleWhatsAppEnquiry = () => {
    const message = `Hello SK Korean Aesthetic Technologies! I am interested in exploring pricing and details for the ${product.name}.\n\nPlease provide me with more information.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/918610345830?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors mb-8 group"
        >
          <div className="p-2 rounded-full bg-border/50 group-hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-primary/5 border border-border/50 shadow-2xl lg:sticky lg:top-32"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10 pointer-events-none" />
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover rounded-[2rem] sm:rounded-[3rem] mix-blend-screen"
            />
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit">
              <Zap className="w-4 h-4" /> Korean Technology
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground mb-4">
              {product.name}
            </h1>
            
            {product.price && (
              <div className="text-2xl sm:text-3xl font-outfit font-bold text-primary mb-6">
                {product.price}
              </div>
            )}
            
            <p className="text-lg text-foreground/70 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Check if product has extended details */}
            {product.longDescription ? (
              <div className="mb-10 space-y-8">
                {/* Key Benefits */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Key Benefits</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.longDescription.keyBenefits.map((benefit: string, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 rounded-full bg-card border border-border/50 text-sm">{benefit}</span>
                    ))}
                  </div>
                </div>

                {/* Wavelengths */}
                {product.longDescription.wavelengths && product.longDescription.wavelengths.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /> Wavelength Capabilities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.longDescription.wavelengths.map((wl: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl bg-card border border-border/50">
                          <span className="font-bold text-primary block mb-1">{wl.name}</span>
                          <span className="text-sm text-foreground/70">{wl.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Handpiece */}
                {product.longDescription.handpiece && (
                  <div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Settings className="w-5 h-5 text-primary" /> Features & Handpiece</h3>
                    <p className="text-sm text-foreground/70 p-3 rounded-xl bg-card border border-border/50">{product.longDescription.handpiece}</p>
                  </div>
                )}

                {/* Technical Specs Table */}
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Technical Specifications</h3>
                  <div className="rounded-2xl overflow-hidden border border-border/50 bg-card">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-border/50">
                        {product.longDescription.specifications.map((spec: any, idx: number) => (
                          <tr key={idx} className="hover:bg-primary/5 transition-colors">
                            <th className="px-4 py-3 font-semibold text-foreground/90 w-1/3 bg-background/30">{spec.label}</th>
                            <td className="px-4 py-3 text-foreground/70">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/50">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Premium Quality</h4>
                    <p className="text-sm text-foreground/60">Built with top-grade materials for clinical precision.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/50">
                  <Shield className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Warranty Support</h4>
                    <p className="text-sm text-foreground/60">Comprehensive technical assistance and warranty.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/50 sm:col-span-2">
                  <Settings className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Custom Parameters</h4>
                    <p className="text-sm text-foreground/60">Adjustable settings to suit various dermatology needs.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleWhatsAppEnquiry}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 hover:-translate-y-1"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enquire via WhatsApp</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
