import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Users, Car, ShieldCheck, Navigation, Wifi, Info, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Optional {
  id: string;
  name: string;
  description: string;
  price: number;
  price_period: string;
}

const getIconForOptional = (name: string) => {
  const icons: Record<string, React.ReactNode> = {
    "Motorista adicional": <Users className="w-5 h-5" />,
    "Tag de pedágio": <Car className="w-5 h-5" />,
    "Proteção estendida": <ShieldCheck className="w-5 h-5" />,
    "GPS": <Navigation className="w-5 h-5" />,
    "Wi-Fi": <Wifi className="w-5 h-5" />,
  };
  return icons[name] || <Package2 className="w-5 h-5" />;
};

export const OptionalsList = () => {
  const { state, dispatch } = useCart();
  const { toast } = useToast();

  const { data: optionals, isLoading } = useQuery({
    queryKey: ['optionals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accessories')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Optional[];
    }
  });

  const handleToggle = (optional: Optional, isChecked: boolean) => {
    if (isChecked) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: optional.id,
          type: 'optional',
          quantity: 1,
          unitPrice: optional.price,
          totalPrice: optional.price,
          name: optional.name
        }
      });
      toast({
        title: "Opcional adicionado",
        description: `${optional.name} foi adicionado à sua reserva.`
      });
    } else {
      dispatch({ type: 'REMOVE_ITEM', payload: optional.id });
      toast({
        title: "Opcional removido",
        description: `${optional.name} foi removido da sua reserva.`
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full rounded-lg bg-gray-200/20" />
        ))}
      </div>
    );
  }

  if (!optionals?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum opcional disponível no momento.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {optionals.map((optional, index) => {
        const isSelected = !!state.items.find(item => item.id === optional.id);

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            key={optional.id}
            className={`
              relative overflow-hidden rounded-xl border transition-all duration-200
              ${isSelected 
                ? 'border-primary/20 bg-primary/5 shadow-lg shadow-primary/10' 
                : 'border-gray-200 bg-white hover:border-primary/20 hover:bg-gray-50'
              }
            `}
          >
            <div className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                    ${isSelected 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    {getIconForOptional(optional.name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                      {optional.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-100"
                        onClick={() => {
                          toast({
                            title: optional.name,
                            description: optional.description,
                          });
                        }}
                      >
                        <Info className="h-4 w-4 text-gray-500" />
                      </Button>
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-primary">
                        R$ {optional.price.toFixed(2)}
                      </span>
                      <span className="text-gray-500">
                        {optional.price_period === 'per_rental' ? 'por aluguel' : 'por dia'}
                      </span>
                    </div>
                  </div>
                </div>

                <Switch
                  checked={isSelected}
                  onCheckedChange={(checked) => handleToggle(optional, checked)}
                  className={`
                    data-[state=checked]:bg-primary
                    data-[state=unchecked]:bg-gray-200
                  `}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};