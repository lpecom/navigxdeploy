import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { EditVehicleDialog } from "@/components/vehicles/EditVehicleDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const { data: availableModels, isLoading: loadingAvailableModels } = useQuery({
    queryKey: ["available-models"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_models")
        .select("*")
        .is("category_id", null);
      
      if (error) throw error;
      return data as CarModel[];
    },
  });

  const addModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const { error } = await supabase
        .from("car_models")
        .update({ category_id: categoryId })
        .eq("id", modelId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-models"] });
      queryClient.invalidateQueries({ queryKey: ["available-models"] });
      toast({
        title: "Sucesso",
        description: "Modelo adicionado à categoria",
      });
    },
  });

  const removeModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const { error } = await supabase
        .from("car_models")
        .update({ category_id: null })
        .eq("id", modelId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-models"] });
      queryClient.invalidateQueries({ queryKey: ["available-models"] });
      toast({
        title: "Sucesso",
        description: "Modelo removido da categoria",
      });
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoryModels?.map((model) => (
            <TableRow key={model.id}>
              <TableCell>{model.name}</TableCell>
              <TableCell>{model.year}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingModel(model)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeModelMutation.mutate(model.id)}
                  >
                    Remover
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isAddingModel} onOpenChange={setIsAddingModel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Modelo à Categoria</DialogTitle>
          </DialogHeader>
          {loadingAvailableModels ? (
            <div>Carregando modelos disponíveis...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableModels?.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell>{model.name}</TableCell>
                    <TableCell>{model.year}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => {
                          addModelMutation.mutate(model.id);
                          setIsAddingModel(false);
                        }}
                      >
                        Adicionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      <EditVehicleDialog
        open={!!editingModel}
        onOpenChange={() => setEditingModel(null)}
        editingCar={editingModel}
        setEditingCar={setEditingModel}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
};