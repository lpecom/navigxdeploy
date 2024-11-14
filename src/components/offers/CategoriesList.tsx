import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Eye, EyeOff } from "lucide-react";
import type { Category } from "@/types/offers";

interface CategoriesListProps {
  categories: Category[] | undefined;
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onToggleVisibility: (category: Category) => void;
  isLoading: boolean;
}

export const CategoriesList = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onToggleVisibility,
  isLoading,
}: CategoriesListProps) => {
  if (isLoading) return <div>Loading categories...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
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
                  selectedCategory?.id === category.id ? "bg-muted/50" : ""
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
                      onClick={() => onSelectCategory(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleVisibility(category)}
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
      </CardContent>
    </Card>
  );
};