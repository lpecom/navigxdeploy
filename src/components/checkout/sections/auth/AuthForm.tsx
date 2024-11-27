import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createDriverDetails, DriverData } from "../../handlers/DriverHandler";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  full_name: z.string().min(3, "Nome completo é obrigatório").optional(),
  cpf: z.string().min(11, "CPF inválido").optional(),
  phone: z.string().min(11, "Telefone inválido").optional(),
  address: z.string().min(3, "Endereço é obrigatório").optional(),
  city: z.string().min(3, "Cidade é obrigatória").optional(),
  state: z.string().min(2, "Estado é obrigatório").optional(),
  postal_code: z.string().min(8, "CEP inválido").optional(),
});

interface AuthFormProps {
  onSuccess: (driverId: string) => void;
}

export const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      cpf: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
    }
  });

  const handleSubmit = async (formData: z.infer<typeof authSchema>) => {
    setIsLoading(true);
    try {
      if (hasAccount) {
        // Login flow
        const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
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
        // Validate required fields for signup
        if (!formData.full_name || !formData.cpf || !formData.phone || 
            !formData.address || !formData.city || !formData.state || !formData.postal_code) {
          throw new Error("Todos os campos são obrigatórios para criar uma conta");
        }

        // Signup flow
        const { data: authData, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signupError) throw signupError;

        if (!authData.user?.id) {
          throw new Error("Failed to create user account");
        }

        // Create driver details with all required fields
        const driverData = await createDriverDetails({
          full_name: formData.full_name,
          email: formData.email,
          cpf: formData.cpf,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          auth_user_id: authData.user.id,
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
            {hasAccount ? (
              <LoginForm form={form} />
            ) : (
              <SignupForm form={form} />
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