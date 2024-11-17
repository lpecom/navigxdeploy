import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    description: string | null;
  };
  onSuccess: () => void;
}

export const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (category) {
        const { error } = await supabase
          .from("car_groups")
          .update(data)
          .eq("id", category.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("car_groups")
          .insert(data);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-categories"] });
      toast({
        title: category ? "Categoria atualizada" : "Categoria criada",
        description: category
          ? "As alterações foram salvas com sucesso."
          : "A nova categoria foi criada com sucesso.",
      });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nome da Categoria
        </label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Descrição
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <Button type="submit" className="w-full">
        {category ? "Salvar Alterações" : "Criar Categoria"}
      </Button>
    </form>
  );
};