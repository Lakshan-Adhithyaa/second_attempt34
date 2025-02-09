import React from 'react';
import { motion } from 'framer-motion';

interface FallingTextProps {
  text: string;
  delay?: number;
}

const FallingText: React.FC<FallingTextProps> = ({ text, delay = 0 }) => {
  const variants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: delay,
      },
    },
  };

  return (
    <motion.span
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {text}
    </motion.span>
  );
};

export default FallingText;
