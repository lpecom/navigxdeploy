import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-16 md:pt-20 bg-[#111]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black" />

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-red-500/10 text-red-500 font-medium text-sm mb-6">
              BLACK FRIDAY NAVIG 2023
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Aluguel de carros com{" "}
              <span className="text-red-500">R$1.200 de desconto!</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Black Friday Navig: estoque limitado por um valor imperdível! 
              Aproveite as melhores ofertas do ano.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg rounded-full"
              >
                Ver ofertas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-full"
              >
                Saiba mais
              </Button>
            </div>

            <p className="text-white/60 text-sm mt-6">
              *Desconto válido apenas nos planos Navig Próprio e Navig Anual, para pessoas acima de 35 anos.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80"
                alt="Black Friday Car Deal"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl p-4 rotate-12 shadow-lg">
                <div className="text-center leading-tight">
                  <div className="text-sm">ATÉ</div>
                  <div className="text-2xl">50%</div>
                  <div className="text-sm">OFF</div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-red-500/20 rounded-full blur-3xl" />
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};