import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { motion } from "framer-motion";

export const Navigation = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-secondary-900/90 backdrop-blur-sm border-b border-secondary-800/20"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <img 
              src="https://i.imghippo.com/files/uafE3798xA.png" 
              alt="Navig Logo" 
              className="h-8 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/plans" className="text-white/80 hover:text-white transition-colors text-sm">
              Nossos planos
            </Link>
            <Link to="/about" className="text-white/80 hover:text-white transition-colors text-sm">
              Vantagens
            </Link>
            <Link to="/locations" className="text-white/80 hover:text-white transition-colors text-sm">
              Endereços
            </Link>
            <Link to="/blog" className="text-white/80 hover:text-white transition-colors text-sm">
              Blog
            </Link>
            <Link to="/faq" className="text-white/80 hover:text-white transition-colors text-sm">
              Dúvidas
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a href="tel:08000180029" className="hidden md:flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">0800 018 0029</span>
            </a>
            <Link to="/login">
              <Button variant="outline" className="hidden md:flex border-white/10 text-white hover:bg-white/10">
                Central do Motorista
              </Button>
            </Link>
            <Button className="bg-primary hover:bg-primary-600 text-white">
              VENDAS
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};