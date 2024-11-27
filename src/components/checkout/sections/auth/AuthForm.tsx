import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createDriverDetails } from "../../handlers/DriverHandler";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(11, "Telefone inválido"),
  address: z.string().min(3, "Endereço é obrigatório"),
  city: z.string().min(3, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  postal_code: z.string().min(8, "CEP inválido"),
});

interface AuthFormProps {
  onSuccess: (driverId: string) => void;
}

export const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
  });

  const handleSubmit = async (data: z.infer<typeof authSchema>) => {
    setIsLoading(true);
    try {
      if (hasAccount) {
        // Login flow
        const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (loginError) throw loginError;

        // Get existing driver details
        const { data: driverData, error: driverError } = await supabase
          .from('driver_details')
          .select('*')
          .eq('auth_user_id', authData.user.id)
          .single();

        if (driverError) throw driverError;
        
        onSuccess(driverData.id);
      } else {
        // Signup flow
        const { data: authData, error: signupError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (signupError) throw signupError;

        // Create driver details
        const driverData = await createDriverDetails({
          ...data,
          auth_user_id: authData.user?.id,
        });

        onSuccess(driverData.id);
      }

      toast.success(
        hasAccount ? "Login realizado com sucesso!" : "Conta criada com sucesso!"
      );
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || "Erro ao processar autenticação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-xl border border-white/10">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {hasAccount ? "Login" : "Criar Conta"}
          </h2>
          <p className="text-gray-400 mt-1">
            {hasAccount
              ? "Entre com sua conta para continuar"
              : "Crie sua conta para continuar com a reserva"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

            {!hasAccount && (
              <>
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

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60">Endereço</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Rua, número, complemento"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/60">Cidade</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="Sua cidade"
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
                            {...field}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="UF"
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
                            {...field}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="00000-000"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? "Processando..."
                  : hasAccount
                  ? "Entrar"
                  : "Criar Conta"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setHasAccount(!hasAccount)}
              >
                {hasAccount
                  ? "Não tem uma conta? Criar conta"
                  : "Já tem uma conta? Fazer login"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Card>
  );
};