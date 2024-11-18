import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomerSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CustomerSelect = ({ value, onChange }: CustomerSelectProps) => {
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, full_name')
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a customer" />
      </SelectTrigger>
      <SelectContent>
        {customers?.map((customer) => (
          <SelectItem key={customer.id} value={customer.id}>
            {customer.full_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};