import React, { useRef, useEffect, useState } from 'react';
import { useInView, animate } from 'framer-motion';

const AnimatedCounter = ({ from = 0, to, duration = 2.5, prefix = '', suffix = '', decimals = 0, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const format = (val) => {
    return prefix + Number(val).toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    }) + suffix;
  };
  
  const [displayValue, setDisplayValue] = useState(format(from));

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration: duration,
        ease: "easeOut",
        onUpdate(value) {
          setDisplayValue(format(value));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, duration, prefix, suffix, decimals]);

  return <span ref={ref} className={className}>{displayValue}</span>;
};

export default AnimatedCounter;
