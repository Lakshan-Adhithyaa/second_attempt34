import React from 'react';

interface GradientTextProps {
  text: string;
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ text, className }) => {
  return (
    <span className={`bg-gradient-to-r from-red-500 to-red-700 text-transparent bg-clip-text ${className}`}>
      {text}
    </span>
  );
};

export default GradientText;
