import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryVehicles } from "./category-edit/CategoryVehicles";
import { CategoryFares } from "./category-edit/CategoryFares";
import { CategoryPlans } from "./category-edit/CategoryPlans";
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
          <DialogTitle>Edit Category: {category.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="fares">Fares</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
          </TabsList>
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