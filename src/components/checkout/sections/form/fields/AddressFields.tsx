import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const AddressFields = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">Endereço</FormLabel>
            <FormControl>
              <Input 
                placeholder="Rua, número, complemento" 
                className="bg-white/5 border-white/10 text-white"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Cidade</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Cidade" 
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
                  placeholder="Estado" 
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
                    const value = e.target.value.replace(/\D/g, "")
                    field.onChange(value)
                  }}
                  value={field.value ? field.value.replace(/(\d{5})(\d{3})/, "$1-$2") : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};