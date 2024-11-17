import { ReactNode, useEffect } from "react";
import { CheckoutHeader } from "./CheckoutHeader";
import { AnnouncementBar } from "./AnnouncementBar";
import { motion } from "framer-motion";

interface CheckoutLayoutProps {
  children: ReactNode;
}

export const CheckoutLayout = ({ children }: CheckoutLayoutProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <CheckoutHeader />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 pt-20 sm:pt-28"
      >
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-5xl">
          {children}
        </div>
      </motion.main>
    </>
  );
};