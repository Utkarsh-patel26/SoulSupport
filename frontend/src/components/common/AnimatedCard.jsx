"use client";

import { motion } from 'framer-motion';

export function AnimatedCard({ 
  children, 
  delay = 0, 
  className = '',
  hover = true,
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-soft ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
