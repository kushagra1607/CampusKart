import React from "react";
import { motion } from "framer-motion";

// Wraps a page so it fades/slides in smoothly on navigation
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
