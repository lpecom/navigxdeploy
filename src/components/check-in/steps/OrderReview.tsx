import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Car, CreditCard, Package, Calendar } from "lucide-react";
import { OrderOptionals } from "./order/OrderOptionals";
import { OrderPaymentStatus } from "./order/OrderPaymentStatus";
import { OrderPlanSelector } from "./order/OrderPlanSelector";
import { OrderGroupSelector } from "./order/OrderGroupSelector";
import type { CheckInReservation } from "../types";

interface OrderReviewProps {
  sessionId: string;
  onNext: () => void;
}

export const OrderReview = ({ sessionId, onNext }: OrderReviewProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isChanging, setIsChanging] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['checkout-session', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(*)
        `)
        .eq('id', sessionId)
        .single();
      
      if (error) throw error;
      
      const selectedCar = data.selected_car as Record<string, any>;
      const optionals = Array.isArray(data.selected_optionals) 
        ? data.selected_optionals.map(opt => ({
            name: (opt as Record<string, any>).name || '',
            price: Number((opt as Record<string, any>).price) || 0
          }))
        : [];

      setSelectedGroup(selectedCar.category || '');
      setSelectedPlan(selectedCar.plan_type || '');

      return {
        ...data,
        selected_car: {
          name: selectedCar.name || '',
          category: selectedCar.category || '',
          plan_type: selectedCar.plan_type || '',
          group_id: selectedCar.group_id,
          price: selectedCar.price,
          period: selectedCar.period
        },
        selected_optionals: optionals
      } as CheckInReservation;
    },
  });

  if (!session) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Revisão do Pedido</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <OrderGroupSelector
          selectedGroup={selectedGroup}
          onGroupChange={setSelectedGroup}
          isChanging={isChanging}
          sessionId={sessionId}
        />

        <OrderPlanSelector
          selectedPlan={selectedPlan}
          onPlanChange={setSelectedPlan}
          isChanging={isChanging}
          sessionId={sessionId}
          categoryId={session.selected_car.group_id}
        />

        <OrderPaymentStatus />

        <OrderOptionals optionals={session.selected_optionals} />
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} size="lg">
          Próximo Passo
        </Button>
      </div>
    </div>
  );
};