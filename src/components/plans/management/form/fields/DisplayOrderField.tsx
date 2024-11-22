import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowUpDown } from "lucide-react";

export const DisplayOrderField = ({ form }: { form: any }) => {
  return (
    <Card className="p-6">
      <FormField
        control={form.control}
        name="display_order"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpDown className="w-5 h-5 text-primary" />
              <FormLabel className="text-lg font-semibold">Display Order</FormLabel>
            </div>
            <FormControl>
              <Input
                type="number"
                min="0"
                {...field}
                onChange={e => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
};