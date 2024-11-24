import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface AddressFieldsProps {
  form: UseFormReturn<any>;
  isLoadingAddress: boolean;
  onPostalCodeChange: (postalCode: string) => void;
}

export const AddressFields = ({ form, isLoadingAddress, onPostalCodeChange }: AddressFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white/80">Endereço</h3>
      
      <FormField
        control={form.control}
        name="postal_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">CEP</FormLabel>
            <FormControl>
              <Input 
                placeholder="00000-000"
                className="bg-white/5 border-white/10 text-white"
                {...field}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  field.onChange(value);
                  if (value.length === 8) {
                    onPostalCodeChange(value);
                  }
                }}
                value={field.value ? field.value.replace(/(\d{5})(\d{3})/, '$1-$2') : ''}
              />
            </FormControl>
            {isLoadingAddress && (
              <div className="flex items-center gap-2 text-sm text-primary mt-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Buscando endereço...</span>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-white/60">Endereço</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Rua, Avenida, etc"
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Número</FormLabel>
              <FormControl>
                <Input 
                  placeholder="123"
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Complemento</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Apto, Sala, etc"
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Bairro</FormLabel>
              <FormControl>
                <Input 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Cidade</FormLabel>
              <FormControl>
                <Input 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Estado</FormLabel>
              <FormControl>
                <Input 
                  className="bg-white/5 border-white/10 text-white"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};