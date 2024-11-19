import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ModelTable } from "./ModelTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { CarModel } from "@/types/vehicles";

interface ModelListProps {
  categoryId: string;
  onAddModel: () => void;
  onEdit: (model: CarModel) => void;
  onImageEdit: (model: CarModel) => void;
}

export const ModelList = ({ categoryId, onAddModel, onEdit, onImageEdit }: ModelListProps) => {
  const { data: categoryModels, isLoading } = useQuery({
    queryKey: ["category-models", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .eq("category_id", categoryId);
      
      if (error) throw error;
      return data as CarModel[];
    },
  });

  if (isLoading) {
    return <div>Carregando modelos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Modelos na Categoria</h3>
        <Button onClick={onAddModel}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Modelo
        </Button>
      </div>

      <ModelTable 
        models={categoryModels || []}
        onEdit={onEdit}
        onImageEdit={onImageEdit}
      />
    </div>
  );
};