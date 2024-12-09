import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Power } from "lucide-react";

export const StatusField = ({ form }: { form: any }) => {
  return (
    <Card className="p-4">
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel className="text-base flex items-center gap-2">
                <Power className="w-5 h-5 text-primary" />
                Status do Plano
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Ativar ou desativar este plano
              </p>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </Card>
  );
};