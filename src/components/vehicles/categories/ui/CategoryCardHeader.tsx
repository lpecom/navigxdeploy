import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Edit2, Trash2 } from "lucide-react";
import type { Category } from "@/types/offers";

interface CategoryCardHeaderProps {
  category: Category;
  onToggleVisibility: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryCardHeader = ({
  category,
  onToggleVisibility,
  onEdit,
  onDelete,
}: CategoryCardHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="space-y-1.5">
        <h3 className="font-semibold leading-none tracking-tight">
          {category.name}
        </h3>
        {category.badge_text && (
          <Badge variant="secondary" className="mt-1">
            {category.badge_text}
          </Badge>
        )}
      </div>
      <div className="flex gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(category);
          }}
          className="hover:bg-secondary/10"
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
            onEdit(category);
          }}
          className="hover:bg-secondary/10"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category);
          }}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};