import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormFields } from "./form/CustomerFormFields";
import { handleCustomerData } from "../handlers/CustomerHandler";
import { CustomerData } from "@/types/customer";

const customerSchema = z.object({
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  birth_date: z.string().min(1, "Data de nascimento é obrigatória"),
  postal_code: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  license_number: z.string().min(1, "CNH é obrigatória"),
  license_expiry: z.string().min(1, "Data de validade da CNH é obrigatória"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit: (data: any) => void;
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      cpf: "",
      phone: "",
      birth_date: "",
      postal_code: "",
      address: "",
      city: "",
      state: "",
      license_number: "",
      license_expiry: "",
    }
  });

  const handleSubmit = async (data: CustomerFormValues) => {
    try {
      const { data: existingDriver } = await supabase
        .from('driver_details')
        .select()
        .or(`email.eq.${data.email},cpf.eq.${data.cpf}`)
        .maybeSingle();

      if (existingDriver) {
        toast.error("Uma conta já existe com este email ou CPF. Por favor, faça login.");
        setShowLoginForm(true);
        setEmail(data.email);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: password || Math.random().toString(36).slice(-8),
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Falha ao criar usuário");

      const customerData: CustomerData = {
        full_name: data.full_name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        birth_date: data.birth_date,
        license_number: data.license_number,
        license_expiry: data.license_expiry,
        postal_code: data.postal_code,
        address: data.address,
        city: data.city,
        state: data.state,
        auth_user_id: authData.user.id
      };
      
      const savedCustomer = await handleCustomerData(customerData);
      onSubmit(savedCustomer);
    } catch (error: any) {
      toast.error("Erro ao salvar dados do cliente");
      console.error('Error saving customer data:', error);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (user) {
        const { data: driverData, error: driverError } = await supabase
          .from('driver_details')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();

        if (driverError) throw driverError;
        onSubmit(driverData);
      }
    } catch (error: any) {
      toast.error("Erro ao fazer login");
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Quem vai dirigir?</h2>
      
      {showLoginForm ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Uma conta já existe com este email. Por favor, faça login para continuar.
          </p>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Senha"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button 
            onClick={handleLoginSubmit}
            className="w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <CustomerFormFields form={form} />
            <Button type="submit" className="w-full">
              Continuar
            </Button>
          </form>
        </Form>
      )}
    </Card>
  );
};