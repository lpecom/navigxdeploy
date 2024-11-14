import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PlanCardProps {
  type: 'weekly' | 'monthly';
  price: string;
  onSelect: () => void;
}

export const PlanCard = ({ type, price, onSelect }: PlanCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl font-bold">
            Navig {type === 'weekly' ? 'Semanal' : 'Mensal'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-gray-600">A partir de</p>
          <p className="text-3xl font-bold">
            R$ {price}
            <span className="text-base font-normal text-gray-600">
              /{type === 'weekly' ? 'semana' : 'mês'}
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            E caução parcelado em 3x no PIX ou no cartão
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm">
              Comece no aluguel e tenha a opção de comprar o veículo ao final do contrato
            </p>
          </div>
          <div className="flex gap-2">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm">
              Valor de compra 20% abaixo do mercado e definido desde a contratação
            </p>
          </div>
          <div className="flex gap-2">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm">
              Facilidade no financiamento no momento da compra Navig Anual
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-semibold">Pague apenas pelos KMs rodados!</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Rodando até 200 KM</span>
              <span>R$ 729,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rodando até 400 KM</span>
              <span>R$ 774,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rodando até 1250 KM</span>
              <span>R$ 904,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rodando até 1500 KM</span>
              <span>R$ 977,00</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={onSelect}
          className="w-full bg-navig hover:bg-navig/90"
        >
          Selecionar plano
        </Button>
      </CardContent>
    </Card>
  );
};