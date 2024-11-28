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
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none" />
      <AnnouncementBar />
      <CheckoutHeader />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative pt-24 sm:pt-28 pb-6 sm:pb-12"
      >
        <div className="container mx-auto px-4 py-4 sm:py-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
};