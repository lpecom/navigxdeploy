import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Route, Plus, X } from "lucide-react";

export const KmRangesField = ({ form }: { form: any }) => {
  const kmRanges = form.watch('bullet_points') || [];

  const addKmRange = () => {
    form.setValue('bullet_points', [...kmRanges, { km: '', price: '' }]);
  };

  const removeKmRange = (index: number) => {
    const newRanges = kmRanges.filter((_: any, i: number) => i !== index);
    form.setValue('bullet_points', newRanges);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Route className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">KM Ranges</h3>
      </div>

      <FormField
        control={form.control}
        name="bullet_points"
        render={() => (
          <FormItem>
            <FormLabel>Price per KM Range</FormLabel>
            <div className="space-y-2">
              {kmRanges.map((range: any, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={range.km}
                    onChange={(e) => {
                      const newRanges = [...kmRanges];
                      newRanges[index] = { ...range, km: e.target.value };
                      form.setValue('bullet_points', newRanges);
                    }}
                    placeholder="KM Range"
                  />
                  <Input
                    value={range.price}
                    onChange={(e) => {
                      const newRanges = [...kmRanges];
                      newRanges[index] = { ...range, price: e.target.value };
                      form.setValue('bullet_points', newRanges);
                    }}
                    placeholder="Price"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeKmRange(index)}
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
              onClick={addKmRange}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add KM Range
            </Button>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
};