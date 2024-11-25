import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OrderGroupSelectorProps {
  selectedGroup: string;
  onGroupChange: (group: string) => void;
  isChanging: boolean;
  sessionId: string;
}

export const OrderGroupSelector = ({
  selectedGroup,
  onGroupChange,
  isChanging,
  sessionId,
}: OrderGroupSelectorProps) => {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data;
    },
  });

  const handleGroupChange = async (newGroup: string) => {
    try {
      const { error } = await supabase
        .from('checkout_sessions')
        .update({
          selected_car: { 
            category: newGroup 
          }
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast.success('Grupo alterado com sucesso');
      onGroupChange(newGroup);
    } catch (error) {
      console.error('Error changing group:', error);
      toast.error('Erro ao alterar grupo');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          Categoria do Veículo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedGroup}
          onValueChange={handleGroupChange}
          disabled={isChanging}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};