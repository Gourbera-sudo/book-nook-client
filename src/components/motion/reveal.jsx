"use client";

import { motion } from "framer-motion";

// Small, reusable entrance animation for sections and cards.
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.15,
  ...props
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
