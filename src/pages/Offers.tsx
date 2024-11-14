import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

const Offers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    badge_text: "",
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch offers for selected category
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
      return data;
    },
    enabled: !!selectedCategory?.id,
  });

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (newCategory) => {
      const { data, error } = await supabase
        .from("categories")
        .insert([newCategory])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsAddingCategory(false);
      setNewCategory({ name: "", description: "", badge_text: "" });
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    },
  });

  // Toggle category visibility mutation
  const toggleCategoryVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_active }) => {
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

  const handleAddCategory = (e) => {
    e.preventDefault();
    addCategoryMutation.mutate(newCategory);
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
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categoriesLoading ? (
              <div>Loading categories...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.map((category) => (
                    <TableRow
                      key={category.id}
                      className={
                        selectedCategory?.id === category.id
                          ? "bg-muted/50"
                          : ""
                      }
                    >
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.badge_text}</TableCell>
                      <TableCell>
                        {category.is_active ? "Active" : "Hidden"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedCategory(category)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              toggleCategoryVisibilityMutation.mutate({
                                id: category.id,
                                is_active: category.is_active,
                              })
                            }
                          >
                            {category.is_active ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Offers List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategory
                ? `Offers in ${selectedCategory.name}`
                : "Select a category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCategory ? (
              offersLoading ? (
                <div>Loading offers...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers?.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>{offer.name}</TableCell>
                        <TableCell>
                          {offer.price} / {offer.price_period}
                        </TableCell>
                        <TableCell>
                          {offer.is_active ? "Active" : "Hidden"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Select a category to view its offers
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Offers;