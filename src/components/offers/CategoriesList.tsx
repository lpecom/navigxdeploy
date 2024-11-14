import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, EyeOff, Trash2, Type } from "lucide-react";
import { useState } from "react";
import { CategoryEditDialog } from "./CategoryEditDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/types/offers";

interface CategoriesListProps {
  categories?: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onToggleVisibility: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  isLoading?: boolean;
}

export const CategoriesList = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onToggleVisibility,
  onDeleteCategory,
  isLoading,
}: CategoriesListProps) => {
  const { toast } = useToast();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [renamingCategory, setRenamingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleRename = async () => {
    if (!renamingCategory || !newCategoryName.trim()) return;

    const { error } = await supabase
      .from("categories")
      .update({ name: newCategoryName.trim() })
      .eq("id", renamingCategory.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to rename category",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Category renamed successfully",
      });
      setRenamingCategory(null);
      setNewCategoryName("");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>Loading categories...</CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories?.map((category) => (
            <div
              key={category.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedCategory?.id === category.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => onSelectCategory(category)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{category.name}</div>
                  {category.description && (
                    <div className="text-sm text-muted-foreground">
                      {category.description}
                    </div>
                  )}
                  {category.badge_text && (
                    <Badge variant="secondary">{category.badge_text}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(category);
                    }}
                  >
                    {category.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(category);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingCategory(category);
                      setNewCategoryName(category.name);
                    }}
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCategoryToDelete(category);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {editingCategory && (
        <CategoryEditDialog
          category={editingCategory}
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category
              "{categoryToDelete?.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (categoryToDelete) {
                  onDeleteCategory(categoryToDelete);
                  setCategoryToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!renamingCategory} onOpenChange={() => setRenamingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter new category name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenamingCategory(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};