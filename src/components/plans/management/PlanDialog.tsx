import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Plans } from "@/types/supabase/plans";
import { PlanForm } from "./form/PlanForm";
import type { PlanFormValues } from "./form/PlanFormSchema";

interface PlanDialogProps {
  plan: Plans | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlanDialog = ({ plan, open, onOpenChange }: PlanDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: PlanFormValues) => {
      const data = {
        name: values.name,
        description: values.description,
        type: values.type,
        period: values.period,
        base_price: values.base_price,
        included_km: values.included_km,
        extra_km_price: values.extra_km_price,
        is_active: values.is_active,
        features: values.features,
        bullet_points: values.bullet_points,
        highlight: values.highlight,
        display_order: values.display_order
      };

      if (plan) {
        const { error } = await supabase
          .from("plans")
          .update(data)
          .eq("id", plan.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("plans")
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({
        title: "Success",
        description: `Plan ${plan ? "updated" : "created"} successfully`,
      });
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {plan ? "Edit Plan" : "New Plan"}
          </DialogTitle>
        </DialogHeader>

        <PlanForm 
          plan={plan} 
          onSubmit={(values) => mutation.mutate(values)} 
        />
      </DialogContent>
    </Dialog>
  );
};