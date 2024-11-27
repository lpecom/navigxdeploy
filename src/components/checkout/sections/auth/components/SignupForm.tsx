import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface SignupFormProps {
  form: UseFormReturn<any>;
  onSubmit?: (formData: any) => Promise<void>;
  isLoading?: boolean;
}

export const SignupForm = ({ form, onSubmit, isLoading }: SignupFormProps) => {
  const handleSubmit = async (data: any) => {
    if (onSubmit) {
      await onSubmit(data);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Criando conta..." : "Criar Conta"}
      </Button>
    </form>
  );
};