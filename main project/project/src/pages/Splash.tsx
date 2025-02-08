import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-red-500 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative lines */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute w-[600px] h-[600px] border-2 border-white/20 rotate-45"
      />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-lg border-2 border-white flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-16 h-16 text-white fill-current">
              <path d="M20.24 6.76a9 9 0 0 0-13.48 0L4.8 8.72a1 1 0 0 0 1.41 1.41l2-2a7 7 0 0 1 9.9 9.9l-2 2a1 1 0 1 0 1.41 1.41l2-2a9 9 0 0 0 0-12.68z"/>
            </svg>
          </div>
        </motion.div>
        
        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold text-white tracking-wider mb-4"
        >
          VITAL FIT
        </motion.h1>
        
        {/* Slogan with word-by-word animation */}
        <div className="flex space-x-2 text-lg">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-200"
          >
            ACHIEVE
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-white font-bold"
          >
            YOUR PRIME
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-gray-200"
          >
            WITH US
          </motion.span>
        </div>
      </div>
    </div>
  );
}

export default Splash;
