import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, ShieldCheck, Award, Zap } from 'lucide-react';

const Hero = ({ loading }: { loading: boolean }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-screen flex items-center overflow-hidden">
      
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`, backgroundSize: '4rem 4rem' }}>
        {/* Radial mask to fade out the grid at edges */}
        <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
          
          {/* Centered Text Content */}
          <div className="flex flex-col items-center text-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={loading ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary text-sm font-semibold mb-8 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Premium Aesthetic Machine Dealer</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={loading ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-6 leading-[1.1] w-full"
            >
              <span className="block text-foreground">Advanced Korean</span>
              <span className="block text-transparent bg-clip-text bg-gold-gradient animate-text-glare pb-2 relative inline-block">
                Aesthetic Technologies
                {/* Decorative gold underline swoosh under text */}
                <svg className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 text-primary opacity-50 drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,10 Q50,25 100,0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={loading ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 max-w-2xl text-lg sm:text-xl text-foreground/70 leading-relaxed"
            >
              Empowering global clinics with next-generation laser systems, anti-aging devices, and premium beauty machinery from elite South Korean laboratories.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={loading ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <a href="#products" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-[1.5rem] bg-gold-gradient text-white font-semibold shadow-[0_10px_30px_rgba(212,175,55,0.25)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-y-1">
                Explore Machines
              </a>
              <a href="https://wa.me/918610345830" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[1.5rem] border-2 border-border bg-card/50 backdrop-blur-md text-foreground hover:border-primary/50 hover:bg-card transition-all group">
                <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" />
                <span>WhatsApp Enquiry</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
