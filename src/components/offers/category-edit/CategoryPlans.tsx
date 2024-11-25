import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PlanForm } from "./plans/PlanForm";
import { PlanTable } from "./plans/PlanTable";
import { useCategoryPlans } from "@/hooks/useCategoryPlans";

interface CategoryPlansProps {
  categoryId: string;
}

export const CategoryPlans = ({ categoryId }: CategoryPlansProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  
  const { data: plans, isLoading } = useCategoryPlans(categoryId);

  const addPlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("category_plans")
        .insert({
          ...data,
          category_id: categoryId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-plans", categoryId] });
      toast({
        title: "Success",
        description: "Plan added successfully",
      });
      setIsAddingPlan(false);
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from("category_plans")
        .delete()
        .eq("id", planId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-plans", categoryId] });
      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });
    },
  });

  if (isLoading) {
    return <div>Loading plans...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Category Plans</h3>
        <Dialog open={isAddingPlan} onOpenChange={setIsAddingPlan}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Plan</DialogTitle>
            </DialogHeader>
            <PlanForm onSubmit={(data) => addPlanMutation.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      <PlanTable 
        plans={plans || []} 
        onDelete={(planId) => deletePlanMutation.mutate(planId)} 
      />
    </div>
  );
};