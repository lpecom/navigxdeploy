import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export interface LoginFormProps {
  form: UseFormReturn<any>;
  onSubmit?: (formData: any) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm = ({ form }: LoginFormProps) => {
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
    </>
  );
};