import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Headset, BookOpen, HeartHandshake, Tag } from 'lucide-react';

const REASONS = [
  {
    title: "Premium Korean Technology",
    description: "Advanced aesthetic machines sourced from leading South Korean manufacturers.",
    icon: Cpu
  },
  {
    title: "Trusted Quality",
    description: "Every machine is built for performance, safety, and long-term reliability.",
    icon: ShieldCheck
  },
  {
    title: "Expert Consultation",
    description: "We help you choose the right equipment for your clinic's specific needs.",
    icon: Headset
  },
  {
    title: "Installation & Training",
    description: "Complete setup guidance and professional operational training.",
    icon: BookOpen
  },
  {
    title: "Reliable After-Sales",
    description: "Dedicated technical assistance and prompt customer service.",
    icon: HeartHandshake
  },
  {
    title: "Competitive Pricing",
    description: "Premium aesthetic solutions at exceptional value for your investment.",
    icon: Tag
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="pt-20 pb-8 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
              Why Choose Us
            </h2>
            <svg className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 h-6 text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]" viewBox="0 0 100 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path 
                d="M5,15 Q50,25 95,5" 
                stroke="url(#gold-gradient-svg-whyus)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                viewport={{ once: true }}
              />
              <defs>
                <linearGradient id="gold-gradient-svg-whyus" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5D061" />
                  <stop offset="50%" stopColor="#E6B830" />
                  <stop offset="100%" stopColor="#B38600" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {REASONS.map((reason, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="group p-8 rounded-[2rem] bg-card/40 border border-border/30 backdrop-blur-md hover:bg-card hover:border-primary/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <reason.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-outfit font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed text-sm">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
