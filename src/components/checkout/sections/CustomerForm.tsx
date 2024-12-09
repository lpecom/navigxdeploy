import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormFields } from "./form/CustomerFormFields";
import { handleCustomerData } from "../handlers/CustomerHandler";
import { CustomerData } from "@/types/customer";
import { useSession } from "@supabase/auth-helpers-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  license_number: z.string().default(""),
  license_expiry: z.string().default(new Date().toISOString()),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit: (data: any) => void;
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  const session = useSession();
  const [hasAccount, setHasAccount] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      license_expiry: new Date().toISOString(),
    }
  });

  const handleSubmit = async (data: CustomerFormValues) => {
    try {
      // If user is not logged in, create a temporary driver profile
      if (!session) {
        const customerData: CustomerData = {
          full_name: data.full_name,
          email: data.email,
          cpf: data.cpf,
          phone: data.phone,
          birth_date: data.birth_date,
          postal_code: data.postal_code || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          license_number: data.license_number,
          license_expiry: data.license_expiry
        };
        
        const savedCustomer = await handleCustomerData(customerData);
        onSubmit(savedCustomer);
        return;
      }

      // For logged in users, fetch their driver details
      const { data: driverDetails, error } = await supabase
        .from('driver_details')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single();

      if (error) throw error;
      onSubmit(driverDetails);
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
      
      {!session && (
        <div className="flex items-center space-x-2 mb-6">
          <Checkbox
            id="has_account"
            checked={hasAccount}
            onCheckedChange={(checked) => setHasAccount(checked as boolean)}
          />
          <label
            htmlFor="has_account"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Já tenho uma conta Navig
          </label>
        </div>
      )}

      {hasAccount && !session ? (
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
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