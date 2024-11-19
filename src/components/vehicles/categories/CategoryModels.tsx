import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { EditVehicleDialog } from "@/components/vehicles/EditVehicleDialog";
import { ModelList } from "./ModelList";
import { AddModelDialog } from "./AddModelDialog";
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

  return (
    <div className="space-y-4">
      <ModelList 
        categoryId={categoryId}
        onAddModel={() => setIsAddingModel(true)}
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