import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "../ImageUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { CarModel } from "@/types/vehicles";

interface ModelEditDialogProps {
  model: CarModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ModelEditDialog = ({ model, open, onOpenChange }: ModelEditDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: fleetVehicles } = useQuery({
    queryKey: ['fleet-vehicles', model?.id],
    queryFn: async () => {
      if (!model?.id) return null;
      const { data, error } = await supabase
        .from('fleet_vehicles')
        .select('*')
        .eq('car_model_id', model.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!model?.id,
  });

  const updateModelMutation = useMutation({
    mutationFn: async (updates: Partial<CarModel>) => {
      const { error } = await supabase
        .from('car_models')
        .update(updates)
        .eq('id', model?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car-models'] });
      toast({
        title: "Modelo atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
      onOpenChange(false);
    },
  });

  const deleteModelMutation = useMutation({
    mutationFn: async () => {
      // First check if there are any fleet vehicles using this model
      const { data: vehicles } = await supabase
        .from('fleet_vehicles')
        .select('id')
        .eq('car_model_id', model?.id);

      if (vehicles && vehicles.length > 0) {
        throw new Error('Este modelo está sendo usado por veículos da frota e não pode ser excluído.');
      }

      const { error } = await supabase
        .from('car_models')
        .delete()
        .eq('id', model?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car-models'] });
      toast({
        title: "Modelo excluído",
        description: "O modelo foi excluído com sucesso.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (url: string) => {
    updateModelMutation.mutate({ image_url: url });
  };

  const handleCategoryChange = (categoryId: string) => {
    updateModelMutation.mutate({ category_id: categoryId });
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este modelo?')) {
      deleteModelMutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Modelo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {fleetVehicles && fleetVehicles.length > 0 && (
            <Alert>
              <AlertDescription>
                Este modelo está sendo usado por {fleetVehicles.length} veículo(s) da frota.
                Algumas operações podem estar limitadas.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Imagem do Modelo</label>
            <ImageUpload
              currentImage={model?.image_url}
              onImageChange={handleImageChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select
              value={model?.category_id || ""}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={fleetVehicles && fleetVehicles.length > 0}
          >
            Excluir Modelo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};