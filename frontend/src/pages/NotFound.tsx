import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 font-outfit relative overflow-hidden">
      
      {/* Background Ornaments */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-red-500/10 blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center z-10"
      >
        <h1 className="text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/20 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-foreground/60 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved. 
          Please check the URL or navigate back.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl font-medium border border-border bg-card hover:bg-border/50 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link 
            to="/"
            className="px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg shadow-primary/20"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </motion.div>
      
    </div>
  );
};

export default NotFound;
