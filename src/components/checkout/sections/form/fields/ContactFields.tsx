import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const ContactFields = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Digite seu email" 
                className="bg-white/5 border-white/10 text-white"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">Telefone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="(00) 00000-0000" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    field.onChange(value)
                  }}
                  value={field.value ? field.value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/60">CPF</FormLabel>
              <FormControl>
                <Input 
                  placeholder="000.000.000-00" 
                  className="bg-white/5 border-white/10 text-white"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    field.onChange(value)
                  }}
                  value={field.value ? field.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : ""}
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