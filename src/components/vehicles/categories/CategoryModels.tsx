import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { EditVehicleDialog } from "@/components/vehicles/EditVehicleDialog";
import { ModelActions } from "./ModelActions";
import { ModelTable } from "./ModelTable";
import { AddModelDialog } from "./AddModelDialog";
import { Plus } from "lucide-react";
import type { CarModel } from "@/types/vehicles";

interface CategoryModelsProps {
  categoryId: string;
}

export const CategoryModels = ({ categoryId }: CategoryModelsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [editingModel, setEditingModel] = useState<CarModel | null>(null);
  const [imageEditModel, setImageEditModel] = useState<CarModel | null>(null);

  const { data: categoryModels, isLoading: loadingCategoryModels } = useQuery({
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;

    const { error } = await supabase
      .from("car_models")
      .update({
        name: editingModel.name,
        description: editingModel.description,
        image_url: editingModel.image_url,
        year: editingModel.year,
      })
      .eq("id", editingModel.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar modelo",
        variant: "destructive",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["category-models"] });
    setEditingModel(null);
    setImageEditModel(null);
    toast({
      title: "Sucesso",
      description: "Modelo atualizado com sucesso",
    });
  };

  if (loadingCategoryModels) {
    return <div>Carregando modelos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Modelos na Categoria</h3>
        <Button onClick={() => setIsAddingModel(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Modelo
        </Button>
      </div>

      <ModelTable 
        models={categoryModels || []}
        onEdit={setEditingModel}
        onImageEdit={setImageEditModel}
      />

      <AddModelDialog 
        categoryId={categoryId}
        open={isAddingModel}
        onOpenChange={setIsAddingModel}
      />

      <EditVehicleDialog
        open={!!editingModel}
        onOpenChange={() => setEditingModel(null)}
        editingCar={editingModel}
        setEditingCar={setEditingModel}
        onSubmit={handleEditSubmit}
      />

      <EditVehicleDialog
        open={!!imageEditModel}
        onOpenChange={() => setImageEditModel(null)}
        editingCar={imageEditModel}
        setEditingCar={setImageEditModel}
        onSubmit={handleEditSubmit}
        imageOnly
      />
    </div>
  );
};