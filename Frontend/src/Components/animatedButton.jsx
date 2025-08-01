import { motion } from 'framer-motion';

const AnimatedButton = ({ children, onClick, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={`bg-primary text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
