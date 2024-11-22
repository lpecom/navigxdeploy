import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ClipboardCheck } from "lucide-react";
import type { InspectionItem } from "../types";

interface InspectionChecklistProps {
  onItemCheck: (itemId: string, checked: boolean) => void;
  checkedItems?: string[];
}

export const InspectionChecklist = ({ onItemCheck, checkedItems = [] }: InspectionChecklistProps) => {
  const { data: items } = useQuery({
    queryKey: ['inspection-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('check_in_inspection_items')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('display_order');
      
      if (error) throw error;
      return data as InspectionItem[];
    },
  });

  const groupedItems = items?.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, InspectionItem[]>) || {};

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardCheck className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Lista de Inspeção</h3>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-medium capitalize">{category}</h4>
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={checkedItems.includes(item.id)}
                    onCheckedChange={(checked) => onItemCheck(item.id, checked as boolean)}
                  />
                  <Label htmlFor={item.id} className="text-sm">
                    {item.name}
                  </Label>
                </div>
              ))}
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </Card>
  );
};