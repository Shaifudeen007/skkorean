import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-border/30 bg-background overflow-hidden pb-24 xl:pb-0">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] rounded-[100%]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-12">
        {/* Top Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-center gap-8 pb-16 border-b border-border/30"
        >
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Ready to <span className="text-transparent bg-clip-text bg-gold-gradient animate-text-glare">Elevate</span> Your Clinic?
            </h2>
            <p className="text-foreground/70 text-lg max-w-xl">
              Partner with us to bring world-class Korean aesthetic machinery to your practice.
            </p>
          </div>
          <a href="#contact" className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            <span>Get in Touch</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          
          {/* Brand Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="text-2xl font-bold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-glare-gradient bg-[length:200%_auto] animate-text-glare">SK</span>
              <span className="bg-clip-text text-transparent bg-gold-gradient ml-1">Korean Aesthetic Technologies</span>
            </span>
            <p className="text-foreground/60 text-sm leading-relaxed mb-8">
              The premier B2B distributor of elite South Korean laser systems and aesthetic devices, empowering professionals worldwide.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/skkoreanaesthetictechnologies?igsh=MWg5b3ppbXF5Znh0Mg==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-card border border-border/50 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <h4 className="font-outfit font-bold text-lg text-foreground mb-6">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link to="/#home" onClick={(e) => {
                if (window.location.pathname === '/') {
                  const el = document.getElementById('home');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }} className="text-foreground/60 hover:text-primary transition-colors text-sm w-fit">Home</Link>
              <Link to="/#about" onClick={(e) => {
                if (window.location.pathname === '/') {
                  const el = document.getElementById('about');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }} className="text-foreground/60 hover:text-primary transition-colors text-sm w-fit">About Us</Link>
              <Link to="/#products" onClick={(e) => {
                if (window.location.pathname === '/') {
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }} className="text-foreground/60 hover:text-primary transition-colors text-sm w-fit">Products</Link>
              <Link to="/#portfolio" onClick={(e) => {
                if (window.location.pathname === '/') {
                  const el = document.getElementById('portfolio');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }} className="text-foreground/60 hover:text-primary transition-colors text-sm w-fit">Projects / Portfolio</Link>
              <Link to="/#contact" onClick={(e) => {
                if (window.location.pathname === '/') {
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }} className="text-foreground/60 hover:text-primary transition-colors text-sm w-fit">Contact Us</Link>
            </div>
          </motion.div>

          {/* Legal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col"
          >
            <h4 className="font-outfit font-bold text-lg text-foreground mb-6">Legal</h4>
            <div className="flex flex-col gap-3">
              <a href="#privacy" className="text-foreground/60 hover:text-primary transition-colors text-sm w-fit">Privacy Policy</a>
              <a href="#terms" className="text-foreground/60 hover:text-primary transition-colors text-sm w-fit">Terms & Conditions</a>
              <a href="#refund" className="text-foreground/60 hover:text-primary transition-colors text-sm w-fit">Refund Policy</a>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col"
          >
            <h4 className="font-outfit font-bold text-lg text-foreground mb-6">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground/60 text-sm leading-relaxed">48/102, Angalamman kovil street,<br/>Choolai, Chennai, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+918610345830" className="text-foreground/60 hover:text-primary transition-colors text-sm">+91 861 034 5830</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:Skbeautyverseofficial@gmail.com" className="text-foreground/60 hover:text-primary transition-colors text-sm break-all">Skbeautyverseofficial@gmail.com</a>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left"
        >
          <p className="text-foreground/50 text-xs">
            © {new Date().getFullYear()} SK Korean Aesthetic Technologies. All rights reserved.
          </p>
          <p className="text-foreground/50 text-xs">
            Designed with <span className="text-primary">♥</span> for Premium Clinics.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
