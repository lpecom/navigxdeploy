import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "./LoginForm";

export const LoginTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const handleLogin = async (formData: any) => {
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Authentication failed');
      }

      const { data: driverData, error: driverError } = await supabase
        .from('driver_details')
        .select('id, crm_status')
        .eq('email', formData.email)
        .maybeSingle();

      if (driverError) throw driverError;

      if (!driverData) {
        throw new Error('No driver profile found for this email.');
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      // Check if we're in the middle of a checkout
      const categoryData = sessionStorage.getItem('selectedCategory');
      if (categoryData) {
        navigate("/checkout");
      } else {
        navigate("/driver");
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Falha ao realizar login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <LoginForm form={form} />
      </form>
    </Form>
  );
};