import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Alugue o carro perfeito para sua jornada
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Descubra nossa frota premium e comece sua aventura hoje mesmo. 
            Oferecemos os melhores veículos com condições flexíveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-navig hover:bg-navig/90 text-white px-8 py-6 text-lg"
              onClick={() => window.location.href = '/plans'}
            >
              Ver Planos
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white px-8 py-6 text-lg"
            >
              Saiba Mais
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};