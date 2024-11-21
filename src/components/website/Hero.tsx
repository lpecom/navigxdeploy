import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-16 md:pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
          alt="Luxury Car"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white font-medium text-sm mb-6 backdrop-blur-sm">
              <span>BLACK FRIDAY NAVIG 2024</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-white mb-6 leading-[1.1] tracking-tight">
              Aluguel de carros com{" "}
              <span className="text-primary-400">R$1.200 de desconto!</span>
            </h1>
            
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Black Friday Navig: estoque limitado por um valor imperdível! 
              Aproveite as melhores ofertas do ano.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300"
              >
                Ver ofertas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
              >
                Saiba mais
              </Button>
            </div>

            <p className="text-gray-400 text-sm mt-6">
              *Desconto válido apenas nos planos Navig Próprio e Navig Anual.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <img
              src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80"
              alt="Black Friday Car Deal"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            
            {/* Floating Badge */}
            <motion.div 
              initial={{ rotate: 12 }}
              animate={{ rotate: [12, 8, 12] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl p-4 shadow-lg"
            >
              <div className="text-center leading-tight">
                <div className="text-sm font-medium opacity-90">ATÉ</div>
                <div className="text-3xl font-display">50%</div>
                <div className="text-sm font-medium opacity-90">OFF</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};