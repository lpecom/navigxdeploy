import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  description: string | null;
  badge_text: string | null;
  is_active: boolean;
  display_order?: number | null;
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
    badge_text: category?.badge_text || "",
    is_active: category?.is_active ?? true,
    display_order: category?.display_order || null,
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
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="badge_text">Texto do Badge</Label>
        <Input
          id="badge_text"
          value={formData.badge_text}
          onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
          placeholder="Ex: Novo, Popular, etc"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_order">Ordem de Exibição</Label>
        <Input
          id="display_order"
          type="number"
          value={formData.display_order || ""}
          onChange={(e) => setFormData({ 
            ...formData, 
            display_order: e.target.value ? parseInt(e.target.value) : null 
          })}
          placeholder="Ordem de exibição (opcional)"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Categoria Ativa</Label>
      </div>

      <Button type="submit" className="w-full">
        {category ? "Atualizar" : "Criar"} Categoria
      </Button>
    </form>
  );
};