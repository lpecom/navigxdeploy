import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PlanTable } from "./PlanTable";
import { PlanDialog } from "./PlanDialog";
import type { Plans } from "@/types/database";

export const PlanList = () => {
  const [editingPlan, setEditingPlan] = useState<Plans | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("type", { ascending: true })
        .order("included_km", { ascending: true });
      
      if (error) throw error;
      return data as Plans[];
    },
  });

  if (isLoading) {
    return <div>Loading plans...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <PlanTable
        plans={plans || []}
        onEdit={(plan) => {
          setEditingPlan(plan);
          setIsDialogOpen(true);
        }}
      />

      <PlanDialog
        plan={editingPlan}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingPlan(null);
        }}
      />
    </div>
  );
};