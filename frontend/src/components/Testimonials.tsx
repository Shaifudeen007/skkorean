import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    role: "Dermatologist",
    image: "/Testimonials/testimonial-1.jpeg",
    text: "Huge thanks to Karthik sir and SK Korean Technologies. The machineries we purchased for our clinic are exceptional in quality and performance. They have completely upgraded our aesthetic treatments."
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    role: "Aesthetic Physician",
    image: "/Testimonials/testimonial-2.jpeg",
    text: "SK Korean Technologies provides the most advanced aesthetic machineries in the market. Karthik sir was incredibly helpful in guiding us to choose the right equipment. The after-sales support is simply outstanding."
  },
  {
    id: 3,
    name: "Dr. Meera Patel",
    role: "Cosmetologist",
    image: "/Testimonials/testimonial-3.jpeg",
    text: "I am amazed by the clinical precision of the machineries from SK Korean Technologies. Special mention to Karthik sir for his expert advice and hands-on training. Truly a game changer for our practice!"
  },
  {
    id: 4,
    name: "Dr. Vikram Singh",
    role: "Plastic Surgeon",
    image: "/Testimonials/testimonial-4.jpeg",
    text: "Investing in machineries from SK Korean Technologies was the best decision for my cosmetic clinic. The results are phenomenal, and Karthik sir's dedication to client satisfaction is what sets them apart."
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
  <div className="w-[320px] sm:w-[400px] flex-shrink-0 bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] shadow-xl hover:border-primary/50 transition-colors mx-4 relative overflow-hidden group flex flex-col whitespace-normal">
    
    {/* Full View Image */}
    <div className="w-full h-[250px] sm:h-[300px] relative overflow-hidden bg-primary/5">
      <img 
        src={testimonial.image} 
        alt="Testimonial" 
        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" 
      />
    </div>

    {/* Content Area */}
    <div className="p-6 sm:p-8 flex-grow flex flex-col items-center">
      <div className="flex gap-1 mb-4 justify-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-foreground/80 text-sm sm:text-base leading-relaxed relative z-10 italic text-center">
        <Quote className="w-10 h-10 text-primary/20 absolute -top-4 -left-4 -z-10" />
        "{testimonial.text}"
      </p>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground"
          >
            Client Testimonials
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative inline-block w-full max-w-xs mx-auto mt-4"
          >
            <svg className="w-32 h-6 mx-auto text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]" viewBox="0 0 100 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M5,15 Q50,25 95,5" 
                stroke="url(#gold-gradient-svg-test)" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
              <defs>
                <linearGradient id="gold-gradient-svg-test" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5D061" />
                  <stop offset="50%" stopColor="#E6B830" />
                  <stop offset="100%" stopColor="#B38600" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto text-lg">
            Hear what our esteemed clients have to say about their experience with SK Korean Aesthetic Technologies.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden flex py-4">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {/* Double the list for infinite scroll effect */}
          {[...testimonials, ...testimonials].map((testimonial, idx) => (
            <TestimonialCard key={`${testimonial.id}-${idx}`} testimonial={testimonial} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
