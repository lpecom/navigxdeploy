import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InsuranceTable } from "./insurance/InsuranceTable";
import { InsuranceDialog } from "./insurance/InsuranceDialog";
import type { InsuranceOptions } from "@/types/database";

export const InsuranceList = () => {
  const [editingInsurance, setEditingInsurance] = useState<InsuranceOptions | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: insuranceOptions, isLoading } = useQuery({
    queryKey: ["insurance-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_options")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as InsuranceOptions[];
    },
  });

  if (isLoading) {
    return <div>Loading insurance options...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Insurance Option
        </Button>
      </div>

      <InsuranceTable
        insuranceOptions={insuranceOptions || []}
        onEdit={(insurance) => {
          setEditingInsurance(insurance);
          setIsDialogOpen(true);
        }}
      />

      <InsuranceDialog
        insurance={editingInsurance}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingInsurance(null);
        }}
      />
    </div>
  );
};