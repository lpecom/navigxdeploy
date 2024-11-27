import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { handleCustomerData } from "../handlers/CustomerHandler";
import { toast } from "sonner";

// Match the schema with CustomerData interface requirements
const customerSchema = z.object({
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit: (data: any) => void;
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      cpf: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
    }
  });

  const handleSubmit = async (data: CustomerFormValues) => {
    try {
      // Ensure all required fields are present before calling handleCustomerData
      const customerData = {
        full_name: data.full_name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        postal_code: data.postal_code || undefined,
      };
      
      const savedCustomer = await handleCustomerData(customerData);
      onSubmit(savedCustomer);
    } catch (error: any) {
      toast.error("Erro ao salvar dados do cliente");
      console.error('Error saving customer data:', error);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Seus Dados</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <PersonalInfoFields form={form} />
          <div className="pt-4">
            <Button type="submit" className="w-full">
              Continuar para Agendamento
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};