import { motion } from "framer-motion";
import { Check, Shield, Clock, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlanDetailsProps {
  plan: {
    type: string;
    name: string;
    features: string[];
    price: number;
    period: string;
  };
}

export const PlanDetails = ({ plan }: PlanDetailsProps) => {
  const iconMap = {
    'Seguro completo incluso': Shield,
    'Manutenção preventiva': Clock,
    'Assistência 24h': Clock,
    'Documentação e IPVA': FileText,
  };

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="secondary" className="mb-2 bg-primary/20 text-primary border-0">
            {plan.type}
          </Badge>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
            {plan.name}
          </h2>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            R$ {plan.price}
            <span className="text-base font-normal text-gray-400 ml-1">/{plan.period}</span>
          </div>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {plan.features.map((feature, index) => {
          const Icon = iconMap[feature as keyof typeof iconMap] || Check;
          return (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 transition-colors hover:bg-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-gray-200">{feature}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};