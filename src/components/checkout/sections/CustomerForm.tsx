import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CustomerFormFields } from "./form/CustomerFormFields";

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
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit: (data: any) => void;
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  const [hasAccount, setHasAccount] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
    }
  });

  const handleSubmit = async (data: CustomerFormValues) => {
    try {
      const customerData = {
        ...data,
        license_number: "",  // Add required fields with empty values
        license_expiry: new Date().toISOString(),  // Add required fields with default values
      };
      
      const savedCustomer = await handleCustomerData(customerData);
      onSubmit(savedCustomer);
    } catch (error: any) {
      toast.error("Erro ao salvar dados do cliente");
      console.error('Error saving customer data:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
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

      {hasAccount ? (
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