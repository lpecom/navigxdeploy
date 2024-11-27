import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignupForm } from "./SignupForm";

export const SignupTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      cpf: "",
      phone: "",
    }
  });

  const handleSignup = async (formData: any) => {
    setIsLoading(true);

    try {
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signupError) throw signupError;

      if (!authData.user) {
        throw new Error('Failed to create account');
      }

      const { data: driverData, error: driverError } = await supabase
        .from('driver_details')
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            cpf: formData.cpf,
            phone: formData.phone,
            auth_user_id: authData.user.id,
            birth_date: new Date().toISOString(),
            license_number: 'PENDING',
            license_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ])
        .select()
        .single();

      if (driverError) throw driverError;

      toast({
        title: "Conta criada com sucesso",
        description: "Você será redirecionado para continuar seu cadastro.",
      });

      // Auto login after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      // Check if we're in the middle of a checkout
      const categoryData = sessionStorage.getItem('selectedCategory');
      if (categoryData) {
        navigate("/checkout");
      } else {
        navigate("/driver");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Falha ao criar conta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
        <SignupForm form={form} />
      </form>
    </Form>
  );
};