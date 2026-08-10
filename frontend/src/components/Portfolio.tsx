import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, X } from 'lucide-react';
import api, { getImageUrl } from '../services/api';

const Portfolio = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/gallery');
        const list = Array.isArray(data) ? data : (data?.gallery || data?.data || []);
        setProjects(list);
      } catch (error) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  if (loading || !Array.isArray(projects) || projects.length === 0) return null;

  return (
    <section id="portfolio" className="pt-12 pb-4 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <div className="relative inline-block">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
              Featured Installations & Portfolio
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project._id || project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onClick={() => setSelectedProject(project)}
              className="group relative h-[350px] sm:h-[400px] rounded-[2rem] overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full bg-primary/5">
                <img 
                  src={getImageUrl(project.url)} 
                  alt={project.title || 'Gallery Image'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors duration-300" />

              {/* Border Overlay */}
              <div className="absolute inset-0 border-[3px] border-white/10 rounded-[2rem] group-hover:border-primary/50 transition-colors duration-300 pointer-events-none z-10" />

              {/* Content */}
              <div className="absolute bottom-0 w-full p-8 flex flex-col justify-end z-20 h-full">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
                    {project.title || 'Installation'}
                  </h3>
                  {project.description && (
                    <p className="text-white/70 text-sm sm:text-base leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-300 mb-6">
                      {project.description}
                    </p>
                  )}
                  
                  <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-0 h-0 hidden" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
      
      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] rounded-2xl overflow-hidden bg-card border border-border/50 shadow-2xl flex flex-col"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative w-full h-[60vh] sm:h-[70vh] bg-black">
                <img
                  src={getImageUrl(selectedProject.url)}
                  alt={selectedProject.title || 'Gallery Image'}
                  className="w-full h-full object-contain"
                />
              </div>
              {(selectedProject.title || selectedProject.description) && (
                <div className="p-6 bg-card">
                  {selectedProject.title && (
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-2">
                      {selectedProject.title}
                    </h3>
                  )}
                  {selectedProject.description && (
                    <p className="text-foreground/70 text-sm sm:text-base">
                      {selectedProject.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
