import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const POPUP_IMAGES = [
  '/pop up/1Freelancer.png',
  '/pop up/2Budget.png',
  '/pop up/3Silver.jpg.jpeg',
  '/pop up/4Gold.jpg.jpeg',
  '/pop up/5Platinum.jpg.jpeg',
  '/pop up/6Diamond.jpg.jpeg',
  '/pop up/7Diamond-2.jpg.jpeg',
  '/pop up/8Diamond -3.png'
];

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    // Check if we already showed it in this session to avoid annoyance
    const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
    if (!hasSeenPopup) {
      // Delay slightly so it doesn't fight with the preloader
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenWelcomePopup', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);


  const nextImage = () => setCurrentIndex((prev) => (prev === POPUP_IMAGES.length - 1 ? 0 : prev + 1));
  const prevImage = () => setCurrentIndex((prev) => (prev === 0 ? POPUP_IMAGES.length - 1 : prev - 1));

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextImage();
    } else if (isRightSwipe) {
      prevImage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
          className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[110] p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div 
          className="relative w-[90vw] h-[85vh] sm:w-[80vw] sm:h-[90vh] max-w-5xl flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={prevImage}
            className="absolute left-2 sm:-left-12 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <div 
            className="w-full h-full relative overflow-hidden rounded-2xl flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                src={POPUP_IMAGES[currentIndex]}
                alt={`Welcome Offer ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
              />
            </AnimatePresence>
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-2 sm:-right-12 z-20 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {POPUP_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomePopup;
