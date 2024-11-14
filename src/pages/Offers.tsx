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
import Sidebar from "@/components/dashboard/Sidebar";
import { CategoryForm } from "@/components/offers/CategoryForm";
import { CategoriesList } from "@/components/offers/CategoriesList";
import { OffersList } from "@/components/offers/OffersList";
import { OfferForm } from "@/components/offers/OfferForm";
import type { Category, Offer } from "@/types/offers";

const Offers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingOffer, setIsAddingOffer] = useState(false);

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
        .select(`
          *,
          categories (
            name,
            badge_text
          )
        `)
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

  const deleteCategoryMutation = useMutation({
    mutationFn: async (category: Category) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", category.id);
      
      if (error) throw error;
    },
    onSuccess: (_, category) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (selectedCategory?.id === category.id) {
        setSelectedCategory(null);
      }
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const handleDeleteCategory = (category: Category) => {
    deleteCategoryMutation.mutate(category);
  };

  const handleEditOffer = (offer: Offer) => {
    // TODO: Implement offer editing
    console.log("Edit offer:", offer);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ofertas</h1>
              <p className="text-muted-foreground">
                Gerencie suas ofertas e categorias
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={isAddingOffer} onOpenChange={setIsAddingOffer}>
                <DialogTrigger asChild>
                  <Button disabled={!selectedCategory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Oferta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Oferta</DialogTitle>
                  </DialogHeader>
                  {selectedCategory && (
                    <OfferForm
                      categoryId={selectedCategory.id}
                      onSuccess={() => setIsAddingOffer(false)}
                    />
                  )}
                </DialogContent>
              </Dialog>
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                  </DialogHeader>
                  <CategoryForm onSuccess={() => setIsAddingCategory(false)} />
                </DialogContent>
              </Dialog>
            </div>
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
              onDeleteCategory={handleDeleteCategory}
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
      </div>
    </div>
  );
};

export default Offers;