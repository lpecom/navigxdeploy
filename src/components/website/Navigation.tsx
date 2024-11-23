import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Menu } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-gray-900/80 backdrop-blur-md border-b border-white/10" />
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src="https://i.imghippo.com/files/uafE3798xA.png" 
              alt="Navig Logo" 
              className="h-8 w-auto"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/plans" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Nossos planos
            </Link>
            <Link to="/about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Vantagens
            </Link>
            <Link to="/locations" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Endereços
            </Link>
            <Link to="/blog" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Blog
            </Link>
            <Link to="/faq" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Dúvidas
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a href="tel:08000180029" className="hidden md:flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">0800 018 0029</span>
            </a>
            
            <Link to="/login">
              <Button 
                variant="outline" 
                className="hidden md:flex border-white/10 text-white hover:bg-white/10 rounded-full"
              >
                Central do Motorista
              </Button>
            </Link>
            
            <Button 
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full shadow-lg shadow-primary-500/25"
            >
              VENDAS
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-gray-900/95 backdrop-blur-lg border-white/10">
                <DropdownMenuItem>
                  <Link to="/plans" className="w-full text-white/80">Nossos planos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/about" className="w-full text-white/80">Vantagens</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/locations" className="w-full text-white/80">Endereços</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/blog" className="w-full text-white/80">Blog</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/faq" className="w-full text-white/80">Dúvidas</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  );
};