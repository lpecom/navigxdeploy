import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SignupFieldsProps {
  form: UseFormReturn<any>;
}

export const SignupFields = ({ form }: SignupFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">Nome Completo</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="bg-white/5 border-white/10 text-white"
                placeholder="João da Silva"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                className="bg-white/5 border-white/10 text-white"
                placeholder="seu@email.com"
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
                {...field}
                className="bg-white/5 border-white/10 text-white"
                placeholder="000.000.000-00"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">Telefone</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="bg-white/5 border-white/10 text-white"
                placeholder="(00) 00000-0000"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white/60">Senha</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="password"
                className="bg-white/5 border-white/10 text-white"
                placeholder="••••••••"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};