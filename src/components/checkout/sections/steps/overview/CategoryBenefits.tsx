import { motion } from "framer-motion";
import { 
  Car, 
  Gauge, 
  Snowflake, 
  Music2, 
  Wifi, 
  ShieldCheck, 
  Wrench 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BENEFITS = [
  {
    icon: Gauge,
    title: "Câmbio Automático",
    description: "Transmissão automática para maior conforto"
  },
  {
    icon: Snowflake,
    title: "Ar Condicionado Digital",
    description: "Controle preciso da temperatura"
  },
  {
    icon: Music2,
    title: "Sistema de Som Premium",
    description: "Áudio de alta qualidade com Bluetooth"
  },
  {
    icon: Wifi,
    title: "Conectividade",
    description: "Wi-Fi e USB para seus dispositivos"
  },
  {
    icon: ShieldCheck,
    title: "Segurança Avançada",
    description: "Airbags e freios ABS"
  },
  {
    icon: Wrench,
    title: "Manutenção Inclusa",
    description: "Revisões periódicas cobertas"
  }
];

const ADDITIONAL_FEATURES = [
  "Sensor de Estacionamento",
  "Câmera de Ré",
  "Bancos em Couro",
  "Start/Stop",
];

export const CategoryBenefits = ({ category }: { category: any }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge 
          variant="secondary" 
          className="bg-primary/20 text-primary border-0"
        >
          {category?.name || 'SUV Black'}
        </Badge>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
          {category?.description || 'Experimente o máximo em conforto e sofisticação'}
        </h2>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Benefícios Inclusos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-lg bg-white/5 p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <benefit.icon className="w-6 h-6 text-primary mb-2" />
              <h3 className="text-base font-medium text-white">
                {benefit.title}
              </h3>
              <p className="text-xs text-gray-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="mt-4 bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10"
      >
        <h3 className="text-base font-medium text-white mb-3">
          Características Adicionais
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {ADDITIONAL_FEATURES.map((feature) => (
            <div 
              key={feature}
              className="flex items-center gap-2 text-gray-300"
            >
              <Car className="w-4 h-4 text-primary" />
              <span className="text-xs">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};