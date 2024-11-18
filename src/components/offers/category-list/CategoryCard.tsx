import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, EyeOff, Trash2, Type } from "lucide-react";
import type { Category } from "@/types/offers";

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: (category: Category) => void;
  onToggleVisibility: (category: Category) => void;
  onEdit: (category: Category) => void;
  onRename: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryCard = ({
  category,
  isSelected,
  onSelect,
  onToggleVisibility,
  onEdit,
  onRename,
  onDelete,
}: CategoryCardProps) => {
  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}
      onClick={() => onSelect(category)}
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
              onEdit(category);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onRename(category);
            }}
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(category);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
};