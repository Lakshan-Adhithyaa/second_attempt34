import React from 'react';
import { motion } from 'framer-motion';

interface TextPressureProps {
  text: string;
  className?: string;
  onTap?: () => void;
}

const TextPressure: React.FC<TextPressureProps> = ({ text, className, onTap }) => {
  return (
    <motion.span
      className={className}
      whileTap={{ scale: 0.95 }}
      onClick={onTap}
    >
      {text}
    </motion.span>
  );
};

export default TextPressure;
