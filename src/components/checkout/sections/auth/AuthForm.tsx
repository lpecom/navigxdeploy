import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SignupFields } from "./components/SignupFields";
import { LoginForm } from "./components/LoginForm";
import { useCart } from "@/contexts/CartContext";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
});

interface AuthFormProps {
  onSuccess: (customerId: string) => void;
}

export const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const { state: cartState } = useCart();
  
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      cpf: "",
      phone: "",
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

        // Get existing customer details
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('email', formData.email)
          .single();

        if (customerError) throw customerError;
        
        onSuccess(customerData.id);
      } else {
        // Signup flow
        const { data: authData, error: signupError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (signupError) throw signupError;

        if (!authData.user?.id) {
          throw new Error("Failed to create user account");
        }

        // Create customer record
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .insert([{
            full_name: formData.full_name,
            email: formData.email,
            cpf: formData.cpf,
            phone: formData.phone,
          }])
          .select()
          .single();

        if (customerError) throw customerError;

        onSuccess(customerData.id);
        toast.success("Conta criada com sucesso!");
      }
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
              <SignupFields form={form} />
            )}

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : "Continuar"}
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