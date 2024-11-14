import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

const driverSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  licenseNumber: z.string().min(3, "CNH é obrigatória"),
  licenseExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
});

type DriverFormValues = z.infer<typeof driverSchema>;

const DriverDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      licenseNumber: "",
      licenseExpiry: "",
      cpf: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = async (data: DriverFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: driverData, error } = await supabase
        .from("driver_details")
        .insert([
          {
            full_name: data.fullName,
            birth_date: data.birthDate,
            license_number: data.licenseNumber,
            license_expiry: data.licenseExpiry,
            cpf: data.cpf,
            phone: data.phone,
            email: data.email,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Get car and optionals data from session storage
      const selectedCar = JSON.parse(sessionStorage.getItem("selectedCar") || "{}");
      const selectedOptionals = JSON.parse(sessionStorage.getItem("selectedOptionals") || "[]");
      
      // Calculate total amount (this is a simplified calculation)
      const totalAmount = parseFloat(selectedCar.price || "0") + 
        selectedOptionals.reduce((acc: number, opt: any) => acc + (opt.price || 0), 0);

      const { error: checkoutError } = await supabase
        .from("checkout_sessions")
        .insert([
          {
            driver_id: driverData.id,
            selected_car: selectedCar,
            selected_optionals: selectedOptionals,
            total_amount: totalAmount,
          },
        ]);

      if (checkoutError) throw checkoutError;

      toast({
        title: "Sucesso!",
        description: "Seus dados foram salvos com sucesso.",
      });

      navigate("/payment");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Informações do Condutor</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="João da Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da CNH</FormLabel>
                  <FormControl>
                    <Input placeholder="00000000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licenseExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade da CNH</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} />
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
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="joao@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Link to="/optionals">
                <Button variant="outline" className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? "Salvando..." : "Continuar"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default DriverDetails;