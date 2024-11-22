import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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

export const PlanCard = ({ type, price, features, kmRanges, onSelect }: PlanCardProps) => {
  return (
    <Card className={`w-full max-w-md mx-auto ${type === 'black' ? 'bg-gray-900 text-white' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl font-bold">
            Navig {planNames[type]}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className={`text-sm ${type === 'black' ? 'text-gray-300' : 'text-gray-600'}`}>A partir de</p>
          <p className="text-3xl font-bold">
            R$ {price}
            <span className={`text-base font-normal ${type === 'black' ? 'text-gray-300' : 'text-gray-600'}`}>
              /mês
            </span>
          </p>
          <p className={`text-sm ${type === 'black' ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
            E caução parcelado em 3x no PIX ou no cartão
          </p>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Check className={`w-5 h-5 ${type === 'black' ? 'text-green-400' : 'text-green-500'} flex-shrink-0`} />
              <p className="text-sm">{feature}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <p className="font-semibold">Pague apenas pelos KMs rodados!</p>
          <div className="space-y-2">
            {kmRanges.map((range, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>Rodando até {range.km}</span>
                <span>R$ {range.price}</span>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={onSelect}
          className={`w-full ${
            type === 'black' 
              ? 'bg-white text-gray-900 hover:bg-gray-100' 
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          Selecionar plano
        </Button>
      </CardContent>
    </Card>
  );
};