import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface PlanCardProps {
  type: 'flex' | 'monthly' | 'black';
  price: string;
  features: string[];
  kmRanges: { km: string; price: string; }[];
  onSelect: () => void;
}

const planNames = {
  flex: 'Flex',
  monthly: 'Mensal',
  black: 'Black'
};

const planStyles = {
  flex: 'bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:border-blue-500/30',
  monthly: 'bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20 hover:border-purple-500/30',
  black: 'bg-gradient-to-br from-gray-800 to-gray-900 border-white/10 hover:border-white/20'
};

const buttonStyles = {
  flex: 'bg-blue-500 hover:bg-blue-600',
  monthly: 'bg-purple-500 hover:bg-purple-600',
  black: 'bg-white text-gray-900 hover:bg-gray-100'
};

export const PlanCard = ({ type, price, features, kmRanges, onSelect }: PlanCardProps) => {
  return (
    <Card className={`backdrop-blur-xl border ${planStyles[type]} text-white h-full`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl font-bold">
            Navig {planNames[type]}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-gray-400">A partir de</p>
          <p className="text-3xl font-bold">
            R$ {price}
            <span className="text-base font-normal text-gray-400">
              /mês
            </span>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            E caução parcelado em 3x no PIX ou no cartão
          </p>
        </div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Check className="w-5 h-5 text-primary-400 flex-shrink-0" />
              <p className="text-sm text-gray-300">{feature}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="space-y-4">
          <p className="font-semibold text-gray-200">Pague apenas pelos KMs rodados!</p>
          <div className="space-y-2">
            {kmRanges.map((range, index) => (
              <div key={index} className="flex justify-between text-sm text-gray-300">
                <span>Rodando até {range.km}</span>
                <span>R$ {range.price}</span>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={onSelect}
          className={`w-full ${buttonStyles[type]} transition-all duration-300`}
        >
          Selecionar plano
        </Button>
      </CardContent>
    </Card>
  );
};