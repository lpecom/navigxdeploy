import { motion } from "framer-motion";
import { Car, ShieldCheck, Gauge, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BENEFITS = [
  {
    icon: Gauge,
    title: "Câmbio Automático",
    description: "Transmissão automática"
  },
  {
    icon: ShieldCheck,
    title: "Segurança",
    description: "Airbags e ABS"
  },
  {
    icon: Wifi,
    title: "Conectividade",
    description: "Wi-Fi e USB"
  }
];

export const CategoryBenefits = ({ category }: { category: any }) => {
  return (
    <div className="space-y-6 bg-gray-900/30 rounded-xl p-6 backdrop-blur-sm border border-white/10">
      <div className="space-y-2">
        <Badge 
          variant="secondary" 
          className="bg-primary/20 text-primary border-0 px-3 py-1 text-sm"
        >
          {category?.name || 'SUV Black'}
        </Badge>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
          {category?.description || 'Experimente o máximo em conforto'}
        </h2>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Benefícios Inclusos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-lg bg-white/5 p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <benefit.icon className="w-6 h-6 text-primary mb-2" />
              <h3 className="text-base font-medium text-white mb-1">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};