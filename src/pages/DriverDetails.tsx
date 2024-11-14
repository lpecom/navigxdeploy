import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { DriverForm } from "@/components/driver/DriverForm";

export const driverSchema = z.object({
  fullName: z.string().min(3, "Nome completo é obrigatório"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  licenseNumber: z.string().min(3, "CNH é obrigatória"),
  licenseExpiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
});

export type DriverFormValues = z.infer<typeof driverSchema>;

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
            crm_status: 'pending_payment',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const selectedCarStr = sessionStorage.getItem("selectedCar");
      const selectedOptionalsStr = sessionStorage.getItem("selectedOptionals");
      
      if (!selectedCarStr) {
        throw new Error("No car selected");
      }

      const selectedCar = JSON.parse(selectedCarStr);
      const selectedOptionals = selectedOptionalsStr ? JSON.parse(selectedOptionalsStr) : [];

      // Extract numeric price value from string (e.g., "R$ 934" -> 934)
      const carPrice = selectedCar.price ? parseFloat(selectedCar.price.replace(/[^0-9.]/g, '')) : 0;
      
      // Calculate total amount ensuring we have numeric values
      const optionalsTotal = selectedOptionals.reduce((acc: number, opt: any) => {
        const optPrice = typeof opt.price === 'string' 
          ? parseFloat(opt.price.replace(/[^0-9.]/g, ''))
          : (typeof opt.price === 'number' ? opt.price : 0);
        return acc + optPrice;
      }, 0);

      const totalAmount = carPrice + optionalsTotal;

      if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error("Invalid total amount calculated");
      }

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
      console.error('Submission error:', error);
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar seus dados. Tente novamente.",
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
            <DriverForm form={form} />

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