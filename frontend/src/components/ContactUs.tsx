import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you! Your enquiry has been sent. We will contact you shortly.");
    }, 1500);
  };

  return (
    <section id="contact" className="pt-20 pb-8 relative overflow-hidden scroll-mt-20">
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
              Contact Us
            </h2>
            <svg className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 h-6 text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]" viewBox="0 0 100 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path 
                d="M5,15 Q50,25 95,5" 
                stroke="url(#gold-gradient-svg-contact)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                viewport={{ once: true }}
              />
              <defs>
                <linearGradient id="gold-gradient-svg-contact" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5D061" />
                  <stop offset="50%" stopColor="#E6B830" />
                  <stop offset="100%" stopColor="#B38600" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="mt-10 text-foreground/70 max-w-2xl text-lg">
            Have questions about our aesthetic machinery or pricing? Fill out the form below and our dedicated team will get back to you immediately.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
          
          {/* Contact Information Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-8"
          >
            <div className="p-8 rounded-[2rem] bg-card/40 border border-border/30 backdrop-blur-md flex flex-col gap-8">
              <h3 className="text-2xl font-serif font-bold text-foreground">Get in Touch</h3>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="font-outfit font-bold text-foreground mb-1">Head Office</span>
                  <span className="text-foreground/70 text-sm leading-relaxed">48/102, Angalamman kovil street,<br/>Choolai, Chennai, India</span>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="font-outfit font-bold text-foreground mb-1">Phone Number</span>
                  <a href="tel:+918610345830" className="text-foreground/70 hover:text-primary transition-colors text-sm">+91 861 034 5830</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col pt-1">
                  <span className="font-outfit font-bold text-foreground mb-1">Email Address</span>
                  <a href="mailto:Skbeautyverseofficial@gmail.com" className="text-foreground/70 hover:text-primary transition-colors text-sm">Skbeautyverseofficial@gmail.com</a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-[2rem] bg-card/60 border-[2px] border-border/50 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground/80 pl-1">Full Name *</label>
                  <input type="text" id="name" required placeholder="John Doe" className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground/80 pl-1">Phone Number *</label>
                  <input type="tel" id="phone" required placeholder="+91 00000 00000" className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground/80 pl-1">Email Address</label>
                <input type="email" id="email" placeholder="john@clinic.com" className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="machine" className="text-sm font-medium text-foreground/80 pl-1">Interested Machinery</label>
                <select id="machine" defaultValue="" className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none">
                  <option value="" disabled>Select an option...</option>
                  <option value="laser">Premium Laser Systems</option>
                  <option value="anti-aging">Anti-Aging Devices</option>
                  <option value="body-contour">Body Contouring Machines</option>
                  <option value="general">General Enquiry / Partnership</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground/80 pl-1">Message</label>
                <textarea id="message" rows={4} placeholder="Tell us about your clinic's needs..." className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="group relative w-full flex justify-center items-center gap-2 mt-2 px-8 py-4 rounded-xl bg-gold-gradient text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactUs;
