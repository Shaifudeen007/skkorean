import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    title: "Posh end unisex salon",
    location: "Hosur",
    description: "Premium aesthetic clinic setup with advanced laser and skin rejuvenation systems.",
    image: "/portfolio/1.png"
  },
  {
    id: 2,
    title: "Sreesha aesthetic",
    location: "Vijay Nagar, Bangalore",
    description: "Complete integration of Korean aesthetic technology and professional skin care devices.",
    image: "/portfolio/2.png"
  },
  {
    id: 3,
    title: "Saghas aesthetic studio",
    location: "Arakonam",
    description: "State-of-the-art beauty and laser studio equipped with cutting-edge dermatology machines.",
    image: "/portfolio/3.png"
  }
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="pt-20 pb-8 relative overflow-hidden scroll-mt-20">
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
              Featured Installations
            </h2>
            <svg className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 h-6 text-primary drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]" viewBox="0 0 100 20" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path 
                d="M5,15 Q50,25 95,5" 
                stroke="url(#gold-gradient-svg-portfolio)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                viewport={{ once: true }}
              />
              <defs>
                <linearGradient id="gold-gradient-svg-portfolio" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5D061" />
                  <stop offset="50%" stopColor="#E6B830" />
                  <stop offset="100%" stopColor="#B38600" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="mt-10 text-foreground/70 max-w-2xl text-lg">
            Discover how leading clinics and dermatology centers worldwide have transformed their practices using our premium Korean machinery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative h-[350px] sm:h-[400px] rounded-[2rem] overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors duration-300" />

              {/* Border Overlay */}
              <div className="absolute inset-0 border-[3px] border-white/10 rounded-[2rem] group-hover:border-primary/50 transition-colors duration-300 pointer-events-none z-10" />

              {/* Content Content */}
              <div className="absolute bottom-0 w-full p-8 flex flex-col justify-end z-20 h-full">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold tracking-wide uppercase">{project.location}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-300 mb-6">
                    {project.description}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-0 h-0 hidden" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Portfolio;
