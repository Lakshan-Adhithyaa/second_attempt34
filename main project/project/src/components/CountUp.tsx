import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountUpProps {
  start: number;
  end: number;
  duration: number;
}

const CountUp: React.FC<CountUpProps> = ({ start, end, duration }) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min(1, (currentTime - startTime) / (duration * 1000));
      setCount(start + (end - start) * progress);
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [start, end, duration]);

  return <span>{Math.round(count)}</span>;
};

export default CountUp;
