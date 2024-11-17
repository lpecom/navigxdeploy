import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import navigLogo from "@/assets/navig-logo.png";

export const CheckoutHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={navigLogo}
              alt="Navig Logo" 
              className="h-8 w-auto"
            />
          </Link>
          <div className="text-sm text-gray-500">
            Checkout seguro
          </div>
        </div>
      </div>
    </header>
  );
};