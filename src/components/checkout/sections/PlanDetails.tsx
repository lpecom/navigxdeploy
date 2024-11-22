import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Users, Gauge, Calendar, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export interface PlanDetailsProps {
  plan: {
    type: string;
    name: string;
    features: string[];
    price: number;
    period: string;
  };
  onNext?: () => void;
}

export const PlanDetails = ({ plan, onNext }: PlanDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-center gap-3 mb-6">
          <Car className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {plan.type}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
              <span className="text-sm text-gray-600">5 Lugares</span>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Gauge className="w-5 h-5 mx-auto mb-2 text-primary" />
              <span className="text-sm text-gray-600">Automático</span>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
              <span className="text-sm text-gray-600">{plan.period}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Incluso no plano:</h4>
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-600">Valor do plano</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">
                  R$ {plan.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-600">/{plan.period}</span>
              </div>
            </div>
          </div>

          {onNext && (
            <Button onClick={onNext} className="w-full mt-4">
              Continuar
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};