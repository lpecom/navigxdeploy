import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { AddressFields } from "./form/AddressFields";
import { useState } from "react";

const customerSchema = z.object({
  first_name: z.string().min(2, "Nome é obrigatório"),
  last_name: z.string().min(2, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(11, "Telefone inválido").max(11, "Telefone inválido"),
  cpf: z.string().min(11, "CPF inválido").max(11, "CPF inválido"),
  is_over_25: z.boolean().refine((val) => val === true, {
    message: "Você precisa ter 25 anos ou mais para alugar",
  }),
  postal_code: z.string().min(8, "CEP inválido").max(8, "CEP inválido"),
  address: z.string().min(3, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit: (data: CustomerFormValues) => void;
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      cpf: "",
      is_over_25: false,
      postal_code: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    }
  });

  const handlePostalCodeChange = async (postalCode: string) => {
    if (postalCode.length === 8) {
      setIsLoadingAddress(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${postalCode}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          form.setValue('address', data.logradouro);
          form.setValue('neighborhood', data.bairro);
          form.setValue('city', data.localidade);
          form.setValue('state', data.uf);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      } finally {
        setIsLoadingAddress(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-black/40 backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-semibold mb-6 text-white">Quem vai dirigir?</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoFields form={form} />
            <AddressFields 
              form={form} 
              isLoadingAddress={isLoadingAddress}
              onPostalCodeChange={handlePostalCodeChange}
            />
          </form>
        </Form>
      </Card>
    </motion.div>
  );
};