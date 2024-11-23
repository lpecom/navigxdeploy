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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none" />
      <AnnouncementBar />
      <CheckoutHeader />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative pt-28 sm:pt-36 pb-12"
      >
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-5xl">
          {children}
        </div>
      </motion.main>
    </div>
  );
};