import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Users, Road, ShieldCheck, Navigation, Wifi, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Optional {
  id: string;
  name: string;
  description: string;
  price: number;
  price_period: string;
}

const getIconForOptional = (name: string) => {
  const icons: Record<string, React.ReactNode> = {
    "Additional driver": <Users className="w-5 h-5" />,
    "Toll pass/Express lane": <Road className="w-5 h-5" />,
    "Extended Roadside Protection": <ShieldCheck className="w-5 h-5" />,
    "GPS": <Navigation className="w-5 h-5" />,
    "SIXT Connect": <Wifi className="w-5 h-5" />,
  };
  return icons[name] || <Info className="w-5 h-5" />;
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
        title: "Optional Added",
        description: `${optional.name} has been added to your booking.`
      });
    } else {
      dispatch({ type: 'REMOVE_ITEM', payload: optional.id });
      toast({
        title: "Optional Removed",
        description: `${optional.name} has been removed from your booking.`
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!optionals?.length) {
    return <div className="text-white/60">No optionals available.</div>;
  }

  return (
    <div className="space-y-2">
      {optionals.map((optional, index) => {
        const isSelected = !!state.items.find(item => item.id === optional.id);

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            key={optional.id}
            className="group relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {getIconForOptional(optional.name)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white mb-0.5 flex items-center gap-2">
                    {optional.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-white/10"
                      onClick={() => {
                        toast({
                          title: optional.name,
                          description: optional.description,
                        });
                      }}
                    >
                      <Info className="h-4 w-4 text-white/60" />
                    </Button>
                  </h3>
                  <p className="text-sm text-white/60">
                    ${optional.price.toFixed(2)} 
                    <span className="ml-1">
                      {optional.price_period === 'per_rental' ? 'per rental' : 'per day'}
                    </span>
                  </p>
                </div>
              </div>

              <Switch
                checked={isSelected}
                onCheckedChange={(checked) => handleToggle(optional, checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};