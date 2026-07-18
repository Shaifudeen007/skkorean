import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // Extended slightly to 3.5s to show off the cool animation
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      {/* Background Pulse Rings */}
      <motion.div
        animate={{ scale: [1, 2, 3], opacity: [0.5, 0.2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        className="absolute w-[300px] h-[300px] border border-primary/20 rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 2.5, 4], opacity: [0.3, 0.1, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
        className="absolute w-[400px] h-[400px] border border-primary/10 rounded-full"
      />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative flex flex-col items-center z-10"
      >
        {/* Logo Container with border and laser scanner */}
        <div className="relative p-1 rounded-full bg-gradient-to-tr from-transparent via-primary to-transparent shadow-[0_0_50px_rgba(212,175,55,0.4)] mb-8">
          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden bg-background flex items-center justify-center p-1">
            <img 
              src="/logo/logo.jpeg" 
              alt="SK Korean Technologies Logo" 
              className="w-full h-full object-cover rounded-full mix-blend-screen"
            />
            {/* Laser Scanner Line */}
            <motion.div
              animate={{ top: ['-10%', '110%', '-10%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_#D4AF37] z-20"
            />
            {/* Scanner Overlay Gradient */}
            <motion.div
              animate={{ top: ['-10%', '110%', '-10%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-12 bg-gradient-to-b from-transparent to-primary/30 z-10 -mt-12"
            />
          </div>
        </div>

        {/* Brand Text Reveal */}
        <div className="text-3xl md:text-5xl font-bold tracking-tight font-outfit flex overflow-hidden">
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "backOut" }}
            className="flex items-center"
          >
            <span className="bg-clip-text text-transparent bg-glare-gradient bg-[length:200%_auto] animate-text-glare pr-2">SK</span>
            <span className="bg-clip-text text-transparent bg-gold-gradient relative">
              Korean Technologies
              {/* Animated underline */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                className="absolute -bottom-2 left-0 h-[2px] bg-gold-gradient"
              />
            </span>
          </motion.div>
        </div>

        {/* Elegant Spinner Loader */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="mt-12 w-8 h-8 rounded-full border-[3px] border-primary/20 border-t-primary shadow-[0_0_10px_rgba(212,175,55,0.2)]"
        />
      </motion.div>
    </motion.div>
  );
};

export default Preloader;
