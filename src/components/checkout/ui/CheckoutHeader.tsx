import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CheckoutHeader = () => {
  return (
    <header className="fixed top-8 sm:top-10 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-md border border-white/10"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
          <div className="relative flex items-center justify-between h-16 sm:h-20 px-6">
            <Link to="/" className="flex items-center">
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                src="https://i.imghippo.com/files/uafE3798xA.png"
                alt="Navig Logo" 
                className="h-6 sm:h-8 w-auto"
              />
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400 hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Checkout seguro
              </div>
              <Button variant="ghost" size="icon" className="sm:hidden text-gray-400 hover:text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};