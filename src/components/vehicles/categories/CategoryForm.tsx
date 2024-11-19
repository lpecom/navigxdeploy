import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface CategoryFormProps {
  category?: Category;
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
          .from("categories")
          .update(data)
          .eq("id", category.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([data]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["car-categories"] });
      toast({
        title: "Sucesso",
        description: category 
          ? "Categoria atualizada com sucesso" 
          : "Categoria criada com sucesso",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a categoria",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Nome</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Descrição</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <Button type="submit" className="w-full">
        {category ? "Atualizar" : "Criar"} Categoria
      </Button>
    </form>
  );
};