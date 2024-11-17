import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          <span className="inline-block text-navig font-semibold text-lg mb-4">
            Aluguel de Carros Premium
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Dirija com Estilo e Conforto
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Descubra nossa frota premium e comece sua aventura hoje mesmo. 
            Oferecemos os melhores veículos com condições flexíveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-navig hover:bg-navig/90 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={() => window.location.href = '/plans'}
            >
              Ver Planos
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white px-8 py-6 text-lg rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
            >
              Saiba Mais
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="w-[30px] h-[50px] rounded-full border-2 border-white/30 flex justify-center p-2">
          <motion.div
            className="w-1 h-3 bg-white rounded-full"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};