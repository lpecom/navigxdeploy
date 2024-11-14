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
    name: "GPS Navigation",
    description: "Satellite navigation system with the latest maps loaded.",
    price: 15.00,
    priceType: "per_rental"
  },
  {
    id: "wifi",
    name: "WiFi Access",
    description: "Wireless internet access for laptops, smartphones and tablets.",
    price: 50.00,
    priceType: "per_rental"
  },
  {
    id: "winter",
    name: "Winter Package",
    description: "Winter tires, ice scraper and snow chains - recommended for winter conditions.",
    price: 35.00,
    priceType: "per_rental"
  },
  {
    id: "ski",
    name: "Ski Rack",
    description: "Safe trunk for four ski sets.",
    price: 199.00,
    priceType: "per_rental"
  },
  {
    id: "insurance",
    name: "Full Insurance",
    description: "Full insurance covers every exterior and mechanical part of your car. Excess cover amount is fully covered.",
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
          title: "Optional Added",
          description: `${optionals.find(opt => opt.id === id)?.name} has been added to your order.`
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
              ${optional.price.toFixed(2)} {optional.priceType === 'per_rental' ? 'per rental' : 'per day'}
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