import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Optional {
  id: string;
  name: string;
  description: string;
  price: number;
  price_period: string;
}

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

  const updateQuantity = (optional: Optional, delta: number) => {
    const currentItem = state.items.find(item => item.id === optional.id);
    const newQuantity = (currentItem?.quantity || 0) + delta;

    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: optional.id });
    } else if (newQuantity > 0) {
      if (!currentItem) {
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
      } else {
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: { id: optional.id, quantity: newQuantity }
        });
      }

      toast({
        title: "Optional Atualizado",
        description: `${optional.name} foi ${delta > 0 ? 'adicionado ao' : 'atualizado no'} seu pedido.`
      });
    }
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-slate-100 rounded-lg"></div>
      ))}
    </div>;
  }

  return (
    <div className="space-y-6">
      {optionals?.map((optional) => {
        const currentQuantity = state.items.find(item => item.id === optional.id)?.quantity || 0;

        return (
          <div key={optional.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex-1">
              <h3 className="font-medium">{optional.name}</h3>
              <p className="text-sm text-gray-600">{optional.description}</p>
              <p className="text-sm font-medium text-primary mt-1">
                R$ {optional.price.toFixed(2)} {optional.price_period === 'per_rental' ? 'por aluguel' : 'por dia'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(optional, -1)}
                disabled={currentQuantity === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{currentQuantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(optional, 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};