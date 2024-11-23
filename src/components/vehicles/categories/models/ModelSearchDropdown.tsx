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
        .is("category_id", null);

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Modelo
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Buscar modelo..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>
            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : (
              "Nenhum modelo encontrado."
            )}
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {(availableModels || []).map((model) => (
              <CommandItem
                key={model.id}
                value={model.name}
                onSelect={() => {
                  onSelect(model.id);
                  setOpen(false);
                }}
              >
                {model.name} ({model.year || 'N/A'})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};