import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

export const HighlightField = ({ form }: { form: any }) => {
  return (
    <Card className="p-6">
      <FormField
        control={form.control}
        name="highlight"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel className="text-base flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Highlight Plan
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Featured plans will be highlighted in the UI
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