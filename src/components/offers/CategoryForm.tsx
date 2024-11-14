import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/types/offers";

interface CategoryFormProps {
  onSuccess: () => void;
}

export const CategoryForm = ({ onSuccess }: CategoryFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    badge_text: "",
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: Partial<Category>) => {
      const { data, error } = await supabase
        .from("categories")
        .insert([categoryData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onSuccess();
      setNewCategory({ name: "", description: "", badge_text: "" });
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    },
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    addCategoryMutation.mutate(newCategory);
  };

  return (
    <form onSubmit={handleAddCategory} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Input
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
        />
      </div>
      <div>
        <label className="text-sm font-medium">Badge Text</label>
        <Input
          value={newCategory.badge_text}
          onChange={(e) =>
            setNewCategory({ ...newCategory, badge_text: e.target.value })
          }
        />
      </div>
      <Button type="submit" className="w-full">
        Add Category
      </Button>
    </form>
  );
};