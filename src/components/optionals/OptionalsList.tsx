import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface Optional {
  id: string;
  name: string;
  description: string;
  price: number;
  price_period: string;
  thumbnail_url: string | null;
}

const defaultThumbnails = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027",
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
];

export const OptionalsList = () => {
  const { state, dispatch } = useCart();
  const { toast } = useToast();

  const { data: optionals, isLoading, error } = useQuery({
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

  if (error) {
    return <div className="text-red-400">Error loading optionals. Please try again.</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-800/50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!optionals?.length) {
    return <div className="text-gray-200">No optionals available.</div>;
  }

  return (
    <div className="space-y-4">
      {optionals.map((optional, index) => {
        const currentQuantity = state.items.find(item => item.id === optional.id)?.quantity || 0;
        const thumbnailUrl = optional.thumbnail_url || defaultThumbnails[Math.floor(Math.random() * defaultThumbnails.length)];

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            key={optional.id}
            className="group relative overflow-hidden rounded-xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-700/40 transition-colors p-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-center gap-6">
              <Avatar className="h-16 w-16 rounded-lg border border-gray-700/50">
                <AvatarImage 
                  src={thumbnailUrl}
                  alt={optional.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gray-800 text-gray-200">
                  {optional.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white mb-1">{optional.name}</h3>
                <p className="text-sm text-gray-300 line-clamp-2">{optional.description}</p>
                <p className="text-sm font-medium text-primary-300 mt-2">
                  R$ {optional.price.toFixed(2)} 
                  <span className="text-gray-300 ml-1">
                    {optional.price_period === 'per_rental' ? 'por aluguel' : 'por dia'}
                  </span>
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(optional, -1)}
                  disabled={currentQuantity === 0}
                  className="border-gray-700 hover:bg-gray-700/50 text-white"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-white">{currentQuantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(optional, 1)}
                  className="border-gray-700 hover:bg-gray-700/50 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};