import { ReactNode } from "react";
import { CheckoutHeader } from "./CheckoutHeader";
import { AnnouncementBar } from "./AnnouncementBar";
import { motion } from "framer-motion";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export const CheckoutLayout = ({ children }: CheckoutLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AnnouncementBar />
      <CheckoutHeader />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="pt-32 pb-16"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          {children}
        </div>
      </motion.main>
    </div>
  );
};