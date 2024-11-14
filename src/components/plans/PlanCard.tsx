import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PlanCardProps {
  type: 'flex' | 'monthly' | 'black';
  price: string;
  onSelect: () => void;
}

const planNames = {
  flex: 'Flex',
  monthly: 'Mensal',
  black: 'Black'
};

const planFeatures = {
  flex: [
    'Comece no aluguel com flexibilidade de devolução',
    'Sem multa por cancelamento com aviso prévio de 30 dias',
    'Facilidade no financiamento no momento da compra Navig Anual'
  ],
  monthly: [
    'Comece no aluguel e tenha a opção de comprar o veículo ao final do contrato',
    'Valor de compra 20% abaixo do mercado e definido desde a contratação',
    'Facilidade no financiamento no momento da compra Navig Anual'
  ],
  black: [
    'Acesso exclusivo aos veículos premium da frota',
    'Serviço de concierge 24/7',
    'Seguro premium com cobertura total incluído'
  ]
};

const planKmRanges = {
  flex: [
    { km: '200 KM', price: '529,00' },
    { km: '400 KM', price: '574,00' },
    { km: '1250 KM', price: '704,00' },
    { km: '1500 KM', price: '777,00' }
  ],
  monthly: [
    { km: '200 KM', price: '729,00' },
    { km: '400 KM', price: '774,00' },
    { km: '1250 KM', price: '904,00' },
    { km: '1500 KM', price: '977,00' }
  ],
  black: [
    { km: '500 KM', price: '1299,00' },
    { km: '1000 KM', price: '1499,00' },
    { km: '2000 KM', price: '1799,00' },
    { km: 'Ilimitado', price: '2299,00' }
  ]
};

export const PlanCard = ({ type, price, onSelect }: PlanCardProps) => {
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
          {planFeatures[type].map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Check className={`w-5 h-5 ${type === 'black' ? 'text-green-400' : 'text-green-500'} flex-shrink-0`} />
              <p className="text-sm">{feature}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <p className="font-semibold">Pague apenas pelos KMs rodados!</p>
          <div className="space-y-2">
            {planKmRanges[type].map((range, index) => (
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
              : 'bg-navig hover:bg-navig/90'
          }`}
        >
          Selecionar plano
        </Button>
      </CardContent>
    </Card>
  );
};