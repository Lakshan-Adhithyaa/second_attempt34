import React from 'react';
import { motion } from 'framer-motion';

interface ShinyTextProps {
  text: string;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, className }) => {
  return (
    <motion.span
      className={`relative overflow-hidden ${className}`}
    >
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-white/50 animate-shine"
        style={{
          maskImage: 'linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,1), rgba(0,0,0,0))',
          WebkitMaskImage: 'linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,1), rgba(0,0,0,0))',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.span>
  );
};

export default ShinyText;
