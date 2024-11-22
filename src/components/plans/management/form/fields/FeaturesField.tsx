import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListChecks, Plus, X } from "lucide-react";

export const FeaturesField = ({ form }: { form: any }) => {
  const features = form.watch('features') || [];

  const addFeature = () => {
    form.setValue('features', [...features, '']);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_: any, i: number) => i !== index);
    form.setValue('features', newFeatures);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Features</h3>
      </div>

      <FormField
        control={form.control}
        name="features"
        render={() => (
          <FormItem>
            <FormLabel>Plan Features</FormLabel>
            <div className="space-y-2">
              {features.map((feature: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[index] = e.target.value;
                      form.setValue('features', newFeatures);
                    }}
                    placeholder={`Feature ${index + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </Button>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
};