import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Loader2 } from "lucide-react";
import type { CarModel } from "@/types/vehicles";

interface ModelSearchDropdownProps {
  categoryId: string;
  onSelect: (modelId: string) => void;
}

export const ModelSearchDropdown = ({ categoryId, onSelect }: ModelSearchDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: availableModels, isLoading } = useQuery({
    queryKey: ["available-models", search],
    queryFn: async () => {
      if (!categoryId) return [];

      let query = supabase
        .from("car_models")
        .select("*")
        .is("category_id", null)
        .order('name');

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching available models:', error);
        return [];
      }
      
      return (data || []) as CarModel[];
    },
    enabled: Boolean(categoryId),
  });

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Digite para buscar modelos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {search && availableModels && availableModels.length > 0 && (
        <div className="border rounded-md shadow-sm bg-white max-h-[300px] overflow-auto">
          {availableModels.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onSelect(model.id);
                setSearch("");
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 text-gray-400" />
              <span>{model.name} ({model.year || 'N/A'})</span>
            </button>
          ))}
        </div>
      )}

      {search && (!availableModels || availableModels.length === 0) && !isLoading && (
        <div className="text-center py-2 text-gray-500">
          Nenhum modelo encontrado
        </div>
      )}
    </div>
  );
};