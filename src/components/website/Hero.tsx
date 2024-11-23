import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-16 md:pt-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-100 font-medium text-sm mb-6 border border-primary-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>PROMOÇÃO EXCLUSIVA NAVIG</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-white mb-6 leading-[1.1] tracking-tight">
              Dirija o carro dos seus{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-primary-600">
                sonhos hoje mesmo
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Alugue carros premium com as melhores condições do mercado. 
              Planos flexíveis que se adaptam ao seu estilo de vida.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300"
              >
                Ver planos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800/50 px-8 py-6 text-lg rounded-full backdrop-blur-sm"
              >
                Saiba mais
              </Button>
            </div>

            <p className="text-gray-400 text-sm mt-6">
              *Sujeito à análise de crédito e disponibilidade
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-transparent to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80"
                alt="Carro Premium"
                className="w-full h-auto rounded-2xl transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Floating Badge */}
            <motion.div 
              initial={{ rotate: 12 }}
              animate={{ rotate: [12, 8, 12] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl p-4 shadow-lg border border-primary-400/20 backdrop-blur-sm"
            >
              <div className="text-center leading-tight">
                <div className="text-sm font-medium opacity-90">ATÉ</div>
                <div className="text-3xl font-display">30%</div>
                <div className="text-sm font-medium opacity-90">OFF</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};