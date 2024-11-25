import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Users, Car, ShieldCheck, Navigation, Wifi, Info, Package2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-32 w-full rounded-xl bg-gray-200/20" />
        ))}
      </div>
    );
  }

  if (!optionals?.length) {
    return (
      <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
        <Package2 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-400">Nenhum opcional disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {optionals.map((optional, index) => {
        const isSelected = !!state.items.find(item => item.id === optional.id);

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            key={optional.id}
            className={`
              relative overflow-hidden rounded-xl border p-6
              transition-all duration-300 hover:shadow-lg
              ${isSelected 
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                : 'border-gray-800 bg-gray-900/50 hover:border-primary/20 hover:bg-gray-800/50'
              }
            `}
          >
            <div className="absolute top-4 right-4">
              <Switch
                checked={isSelected}
                onCheckedChange={(checked) => handleToggle(optional, checked)}
                className={`
                  data-[state=checked]:bg-primary
                  data-[state=unchecked]:bg-gray-700
                `}
              />
            </div>

            <div className="flex items-start gap-4">
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                ${isSelected 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-gray-800 text-gray-400'
                }
              `}>
                {getIconForOptional(optional.name)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-gray-100">{optional.name}</h3>
                  {isSelected && (
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Selecionado
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-400 mb-3">{optional.description}</p>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium text-primary">
                    R$ {optional.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400">
                    {optional.price_period === 'per_rental' ? 'por aluguel' : 'por dia'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};