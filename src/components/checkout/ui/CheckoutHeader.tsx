import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import navigLogo from "@/assets/navig-logo.png";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CheckoutHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center">
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={navigLogo}
              alt="Navig Logo" 
              className="h-6 sm:h-8 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 hidden sm:block">
              Checkout seguro
            </div>
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};