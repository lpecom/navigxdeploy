import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCategoryPlans } from "@/hooks/useCategoryPlans";

interface OrderPlanSelectorProps {
  selectedPlan: string;
  onPlanChange: (plan: string) => void;
  isChanging: boolean;
  sessionId: string;
  categoryId: string;
}

export const OrderPlanSelector = ({
  selectedPlan,
  onPlanChange,
  isChanging,
  sessionId,
  categoryId,
}: OrderPlanSelectorProps) => {
  const { data: plans } = useCategoryPlans(categoryId);

  const handlePlanChange = async (newPlan: string) => {
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({
          selected_car: { 
            plan_type: newPlan 
          }
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast.success('Plano alterado com sucesso');
      onPlanChange(newPlan);
    } catch (error) {
      console.error('Error changing plan:', error);
      toast.error('Erro ao alterar plano');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Plano
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedPlan}
          onValueChange={handlePlanChange}
          disabled={isChanging}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o plano" />
          </SelectTrigger>
          <SelectContent>
            {plans?.map((plan) => (
              <SelectItem key={plan.id} value={plan.type}>
                Navig {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};