import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const Counter = ({ from, to, suffix, duration = 2.5 }: { from: number, to: number, suffix: string, duration?: number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => {
          if (nodeRef.current) {
            nodeRef.current.textContent = Math.floor(value).toString() + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, inView, suffix, duration]);

  return <span ref={nodeRef} className="font-outfit font-bold text-4xl md:text-5xl text-primary">{from}{suffix}</span>;
};

const AboutUs = () => {
  return (
    <section id="about" className="pt-20 pb-8 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
            }}
            className="flex flex-col space-y-6 items-center lg:items-start"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} className="flex flex-col items-center lg:items-start mb-8 w-full">
              <div className="relative inline-block">
                <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
                  About Us
                </h2>
                <motion.svg 
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 h-6 text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]" 
                  viewBox="0 0 100 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path 
                    d="M5,15 Q50,25 95,5" 
                    stroke="url(#gold-gradient-svg)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                    viewport={{ once: true }}
                  />
                  <defs>
                    <linearGradient id="gold-gradient-svg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F5D061" />
                      <stop offset="50%" stopColor="#E6B830" />
                      <stop offset="100%" stopColor="#B38600" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </div>
            </motion.div>
            
            <motion.p 
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}
              className="text-foreground/70 text-lg leading-relaxed max-w-2xl text-justify"
            >
              At <strong className="text-foreground">Advanced Korean Aesthetic Technologies</strong>, we deliver premium Korean aesthetic machines trusted by clinics, dermatologists, and beauty professionals.
            </motion.p>
            <motion.p 
              variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}
              className="text-foreground/70 text-lg leading-relaxed max-w-2xl text-justify"
            >
              We collaborate with <strong className="text-primary">world-class South Korean manufacturers and premium technology partners</strong> to bring innovative laser systems and advanced beauty solutions that combine cutting-edge technology, superior quality, and reliable performance.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-8"
          >
            <div className="p-6 rounded-3xl bg-card border border-primary/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:border-primary hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 flex flex-col items-center text-center group">
              <Counter from={0} to={100} suffix="+" />
              <span className="mt-2 text-sm text-foreground/70 font-medium group-hover:text-primary transition-colors">Premium Machines Delivered</span>
            </div>
            
            <div className="p-6 rounded-3xl bg-card border border-primary/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:border-primary hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 flex flex-col items-center text-center group">
              <Counter from={0} to={50} suffix="+" />
              <span className="mt-2 text-sm text-foreground/70 font-medium group-hover:text-primary transition-colors">Trusted Clinics & Partners</span>
            </div>
            
            <div className="p-6 rounded-3xl bg-card border border-primary/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:border-primary hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 flex flex-col items-center text-center group">
              <Counter from={0} to={100} suffix="%" />
              <span className="mt-2 text-sm text-foreground/70 font-medium group-hover:text-primary transition-colors">Client Satisfaction</span>
            </div>
            
            <div className="p-6 rounded-3xl bg-card border border-primary/30 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:border-primary hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 flex flex-col items-center text-center group">
              <Counter from={0} to={5} suffix="+" />
              <span className="mt-2 text-sm text-foreground/70 font-medium group-hover:text-primary transition-colors">Years Experience</span>
            </div>

            <div className="col-span-2 p-6 rounded-3xl bg-gold-gradient shadow-[0_0_30px_rgba(212,175,55,0.2)] flex flex-col items-center text-center text-white">
              <span className="font-outfit font-bold text-4xl md:text-5xl">24/7</span>
              <span className="mt-2 text-sm font-medium text-white/90">Technical Support</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;
