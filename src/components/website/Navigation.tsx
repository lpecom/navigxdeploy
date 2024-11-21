import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Menu } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const navLinks = [
    { to: "/plans", label: "Nossos planos" },
    { to: "/about", label: "Vantagens" },
    { to: "/locations", label: "Endereços" },
    { to: "/blog", label: "Blog" },
    { to: "/faq", label: "Dúvidas" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src="https://i.imghippo.com/files/uafE3798xA.png" 
              alt="Navig Logo" 
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="tel:08000180029" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">0800 018 0029</span>
            </a>
            
            <Link to="/login">
              <Button 
                variant="outline" 
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Central do Motorista
              </Button>
            </Link>
            
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
              VENDAS
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-lg font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-4 pt-4 space-y-4">
                    <Link to="/login" className="block">
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-200 text-gray-700"
                      >
                        Central do Motorista
                      </Button>
                    </Link>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      VENDAS
                    </Button>
                    <a 
                      href="tel:08000180029" 
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">0800 018 0029</span>
                    </a>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};