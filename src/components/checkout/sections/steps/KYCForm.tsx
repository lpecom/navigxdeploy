import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const kycSchema = z.object({
  full_name: z.string().min(1, "Nome completo é obrigatório"),
  birth_date: z.string().min(1, "Data de nascimento é obrigatória"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("Email inválido"),
  license_number: z.string().min(1, "CNH é obrigatória"),
  license_expiry: z.string().min(1, "Data de validade da CNH é obrigatória"),
});

interface KYCFormProps {
  onSubmit: (data: z.infer<typeof kycSchema>) => void;
}

export const KYCForm = ({ onSubmit }: KYCFormProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof kycSchema>>({
    resolver: zodResolver(kycSchema),
  });

  const handleSubmit = async (values: z.infer<typeof kycSchema>) => {
    try {
      const { data: auth } = await supabase.auth.signUp({
        email: values.email,
        password: Math.random().toString(36).slice(-8), // Generate random password
      });

      if (auth.user) {
        const { error: profileError } = await supabase
          .from('driver_details')
          .insert({
            ...values,
            auth_user_id: auth.user.id,
          });

        if (profileError) throw profileError;
      }

      onSubmit(values);
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você receberá um email para definir sua senha.",
      });
    } catch (error) {
      console.error('KYC submission error:', error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Form fields implementation */}
          <Button type="submit" className="w-full">
            Finalizar Cadastro
          </Button>
        </form>
      </Form>
    </Card>
  );
};