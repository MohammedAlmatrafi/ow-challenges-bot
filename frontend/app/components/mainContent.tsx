import { motion } from "motion/react";

const MainContent = ({ children, ...props }: { children: React.ReactNode }) => {
  return (
    <motion.main
      animate={{ opacity: [0, 1], y: [10, 0], transition: { duration: 0.5 } }}
      exit={{ opacity: 0, y: 10 }}
      {...props}
    >
      {children}
    </motion.main>
  );
};
export default MainContent;
