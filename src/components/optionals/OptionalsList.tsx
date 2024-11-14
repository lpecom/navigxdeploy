import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus } from "lucide-react";

interface Optional {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: 'per_rental' | 'per_day';
}

const optionals: Optional[] = [
  {
    id: "gps",
    name: "GPS Navegação",
    description: "Sistema de navegação por satélite com mapas atualizados.",
    price: 15.00,
    priceType: "per_rental"
  },
  {
    id: "wifi",
    name: "Acesso WiFi",
    description: "Acesso à internet sem fio para notebooks, smartphones e tablets.",
    price: 50.00,
    priceType: "per_rental"
  },
  {
    id: "winter",
    name: "Pacote Inverno",
    description: "Pneus de inverno, raspador de gelo e correntes de neve - recomendado para condições de inverno.",
    price: 35.00,
    priceType: "per_rental"
  },
  {
    id: "ski",
    name: "Suporte para Esqui",
    description: "Porta-malas seguro para quatro conjuntos de esqui.",
    price: 199.00,
    priceType: "per_rental"
  },
  {
    id: "insurance",
    name: "Seguro Completo",
    description: "O seguro completo cobre todas as partes exteriores e mecânicas do seu carro. Valor da franquia totalmente coberto.",
    price: 7.00,
    priceType: "per_day"
  }
];

export const OptionalsList = () => {
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>(
    Object.fromEntries(optionals.map(opt => [opt.id, 0]))
  );
  const { toast } = useToast();

  const updateQuantity = (id: string, delta: number) => {
    setSelectedQuantities(prev => {
      const newValue = Math.max(0, (prev[id] || 0) + delta);
      if (newValue > 0) {
        toast({
          title: "Opcional Adicionado",
          description: `${optionals.find(opt => opt.id === id)?.name} foi adicionado ao seu pedido.`
        });
      }
      return { ...prev, [id]: newValue };
    });
  };

  return (
    <div className="space-y-6">
      {optionals.map((optional) => (
        <div key={optional.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
          <div className="flex-1">
            <h3 className="font-medium">{optional.name}</h3>
            <p className="text-sm text-gray-600">{optional.description}</p>
            <p className="text-sm font-medium text-primary mt-1">
              R$ {optional.price.toFixed(2)} {optional.priceType === 'per_rental' ? 'por aluguel' : 'por dia'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(optional.id, -1)}
              disabled={selectedQuantities[optional.id] === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{selectedQuantities[optional.id]}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(optional.id, 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};