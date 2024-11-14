import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CategoryForm } from "@/components/offers/CategoryForm";
import { CategoriesList } from "@/components/offers/CategoriesList";
import { OffersList } from "@/components/offers/OffersList";
import type { Category, Offer } from "@/types/offers";

const Offers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ["offers", selectedCategory?.id],
    queryFn: async () => {
      if (!selectedCategory?.id) return [];
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .eq("category_id", selectedCategory.id)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Offer[];
    },
    enabled: !!selectedCategory?.id,
  });

  const toggleCategoryVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean | null }) => {
      const { data, error } = await supabase
        .from("categories")
        .update({ is_active: !is_active })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category visibility updated",
      });
    },
  });

  const handleEditOffer = (offer: Offer) => {
    // TODO: Implement offer editing
    console.log("Edit offer:", offer);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offers Management</h1>
        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm onSuccess={() => setIsAddingCategory(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <CategoriesList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onToggleVisibility={(category) =>
            toggleCategoryVisibilityMutation.mutate({
              id: category.id,
              is_active: category.is_active,
            })
          }
          isLoading={categoriesLoading}
        />

        <OffersList
          selectedCategory={selectedCategory}
          offers={offers}
          isLoading={offersLoading}
          onEditOffer={handleEditOffer}
        />
      </div>
    </div>
  );
};

export default Offers;
