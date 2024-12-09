import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
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
  license_number: z.string().default(""),
  license_expiry: z.string().default(new Date().toISOString()),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit: (data: any) => void;
  guestEmail?: string;
  setGuestEmail?: (email: string) => void;
  isGuest?: boolean;
}

export const CustomerForm = ({ 
  onSubmit, 
  guestEmail, 
  setGuestEmail,
  isGuest = false 
}: CustomerFormProps) => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      full_name: "",
      email: guestEmail || "",
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
      if (setGuestEmail) {
        setGuestEmail(data.email);
      }

      const customerData: CustomerData = {
        ...data,
        is_guest: isGuest
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
      <h2 className="text-2xl font-semibold mb-6">Quem vai dirigir?</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <CustomerFormFields form={form} />
          <Button type="submit" className="w-full">
            Continuar
          </Button>
        </form>
      </Form>
    </Card>
  );
};