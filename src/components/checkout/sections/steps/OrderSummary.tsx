import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package } from "lucide-react";

interface OrderSummaryProps {
  checkoutSessionId: string;
  onContinue?: () => void;
}

interface CheckoutSession {
  selected_car: {
    name: string;
    category: string;
    price: number;
    period: string;
  };
  selected_optionals: Array<{
    id: string;
    name: string;
    totalPrice: number;
  }>;
  total_amount: number;
}

export const OrderSummary = ({ checkoutSessionId, onContinue }: OrderSummaryProps) => {
  const { data: session } = useQuery({
    queryKey: ['checkout-session', checkoutSessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select('*')
        .eq('id', checkoutSessionId)
        .single();
      
      if (error) throw error;
      return data as CheckoutSession;
    },
  });

  if (!session) return null;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Veículo Selecionado</h3>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="font-medium">{session.selected_car.name}</p>
            <p className="text-sm text-muted-foreground">
              {session.selected_car.category}
            </p>
            <p className="text-primary font-medium mt-2">
              R$ {session.selected_car.price.toFixed(2)}/{session.selected_car.period}
            </p>
          </div>
        </div>

        {session.selected_optionals && session.selected_optionals.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Opcionais</h3>
            <div className="space-y-2">
              {session.selected_optionals.map((optional) => (
                <div key={optional.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span>{optional.name}</span>
                  </div>
                  <span className="font-medium">
                    R$ {optional.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total</span>
          <span className="text-primary">
            R$ {session.total_amount.toFixed(2)}
          </span>
        </div>

        {onContinue && (
          <Button onClick={onContinue} className="w-full">
            Continuar
          </Button>
        )}
      </div>
    </Card>
  );
};