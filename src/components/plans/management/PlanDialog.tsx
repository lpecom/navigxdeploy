import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Plans } from "@/types/database";
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
      if (plan) {
        const { error } = await supabase
          .from("plans")
          .update(values)
          .eq("id", plan.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("plans")
          .insert([values]);
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
      <DialogContent>
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