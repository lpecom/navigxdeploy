import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CarModelCarousel } from "./CarModelCarousel";
import { 
  Car, 
  Gauge, 
  Snowflake, 
  Music2, 
  Wifi, 
  ShieldCheck, 
  Wrench, 
  Clock 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlanSelectionStepProps {
  onNext: () => void;
}

const DEMO_CATEGORY_BENEFITS = {
  name: "SUV Black",
  description: "Experimente o máximo em conforto e sofisticação",
  benefits: [
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
  ],
  additionalFeatures: [
    "Sensor de Estacionamento",
    "Câmera de Ré",
    "Bancos em Couro",
    "Start/Stop",
  ]
};

export const PlanSelectionStep = ({ onNext }: PlanSelectionStepProps) => {
  const { data: carModels, isLoading } = useQuery({
    queryKey: ['car-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select('*')
        .eq('category', 'SUV Black');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge 
          variant="secondary" 
          className="bg-primary/20 text-primary border-0"
        >
          {DEMO_CATEGORY_BENEFITS.name}
        </Badge>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
          {DEMO_CATEGORY_BENEFITS.description}
        </h2>
      </div>

      {!isLoading && carModels && (
        <CarModelCarousel carModels={carModels} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMO_CATEGORY_BENEFITS.benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl bg-white/5 p-6 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <benefit.icon className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {benefit.title}
            </h3>
            <p className="text-sm text-gray-400">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10"
      >
        <h3 className="text-xl font-semibold text-white mb-4">
          Características Adicionais
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEMO_CATEGORY_BENEFITS.additionalFeatures.map((feature, index) => (
            <div 
              key={feature}
              className="flex items-center gap-2 text-gray-300"
            >
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};