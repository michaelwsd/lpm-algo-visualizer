import { motion } from "framer-motion";

export const PageWrapper = ({ children }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, y: -40, scale: 0.95 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // smooth spring-like curve
      }}
    >
      {children}
    </motion.div>
  );
};
