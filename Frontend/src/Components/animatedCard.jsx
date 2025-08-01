// frontend/src/Components/AnimatedCard.jsx

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const AnimatedCard = ({ children, className = '', reducedMotion = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const cardVariants = {
    // If reduced motion is on, don't slide up (y: 0)
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } 
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`bg-white p-6 rounded-xl shadow-md ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
