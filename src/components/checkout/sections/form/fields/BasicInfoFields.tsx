import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const BasicInfoFields = ({ form }: { form: UseFormReturn<any> }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">Nome</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite seu nome" 
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
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">Sobrenome</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite seu sobrenome" 
                className="bg-white/5 border-white/10 text-white"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};