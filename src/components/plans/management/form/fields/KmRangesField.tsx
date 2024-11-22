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
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Route className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Faixas de KM</h3>
      </div>

      <FormField
        control={form.control}
        name="bullet_points"
        render={() => (
          <FormItem>
            <FormLabel>Preço por Faixa de KM</FormLabel>
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
                    placeholder="Faixa de KM"
                  />
                  <Input
                    value={range.price}
                    onChange={(e) => {
                      const newRanges = [...kmRanges];
                      newRanges[index] = { ...range, price: e.target.value };
                      form.setValue('bullet_points', newRanges);
                    }}
                    placeholder="Preço"
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
              Adicionar Faixa
            </Button>
            <FormMessage />
          </FormItem>
        )}
      />
    </Card>
  );
};