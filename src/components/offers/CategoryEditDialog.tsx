import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryVehicles } from "./category-edit/CategoryVehicles";
import { CategoryFares } from "./category-edit/CategoryFares";
import { CategoryPlans } from "./category-edit/CategoryPlans";
import { CategoryModels } from "./category-edit/CategoryModels";
import type { Category } from "@/types/offers";

interface CategoryEditDialogProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryEditDialog = ({ category, isOpen, onClose }: CategoryEditDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Categoria: {category.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="models" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="models">Modelos</TabsTrigger>
            <TabsTrigger value="vehicles">Veículos</TabsTrigger>
            <TabsTrigger value="fares">Tarifas</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
          </TabsList>
          <TabsContent value="models">
            <CategoryModels categoryId={category.id} />
          </TabsContent>
          <TabsContent value="vehicles">
            <CategoryVehicles categoryId={category.id} />
          </TabsContent>
          <TabsContent value="fares">
            <CategoryFares categoryId={category.id} />
          </TabsContent>
          <TabsContent value="plans">
            <CategoryPlans categoryId={category.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};