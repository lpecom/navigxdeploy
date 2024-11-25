import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center pt-16 md:pt-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-1 gap-16 items-center max-w-4xl mx-auto">
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-100 font-medium text-sm mb-4 border border-primary-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span className="tracking-wide">EXCLUSIVO PARA MOTORISTAS DE APP</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-white leading-[1.1] tracking-tight">
              Maximize seus ganhos com{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-primary-600">
                carros premium
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed font-light">
              A Navig oferece a maior rentabilidade do mercado para motoristas de aplicativo. 
              Carros de luxo, planos flexíveis e suporte 24h para você lucrar mais.
            </p>

            {/* Image moved here */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mx-auto max-w-3xl"
            >
              <img
                src="https://navig.com.br/wp-content/uploads/2024/11/carro.png"
                alt="Carro Premium"
                className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Badge */}
              <motion.div 
                initial={{ rotate: 12 }}
                animate={{ rotate: [12, 8, 12] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl p-4 shadow-lg border border-primary-400/20 backdrop-blur-sm"
              >
                <div className="text-center leading-tight">
                  <div className="text-xs font-medium opacity-90">ATÉ</div>
                  <div className="text-2xl font-display">40%</div>
                  <div className="text-xs font-medium opacity-90">MAIS LUCRO</div>
                </div>
              </motion.div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg"
                className="relative overflow-hidden group bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Começar agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 px-8 py-6 text-lg rounded-full backdrop-blur-sm transition-all duration-300"
              >
                Calcular ganhos
              </Button>
            </div>

            <p className="text-gray-400 text-sm">
              *Sujeito à análise de crédito e disponibilidade
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};