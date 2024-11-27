import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/checkout/sections/auth/components/LoginForm";
import { SignupForm } from "@/components/checkout/sections/auth/components/SignupForm";

const DriverLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if we're in the middle of a checkout
        const categoryData = sessionStorage.getItem('selectedCategory');
        if (categoryData) {
          navigate("/checkout");
        } else {
          navigate("/driver");
        }
      }
    };
    checkSession();
  }, [navigate]);

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

  const handleSignup = async (formData: any) => {
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <img
            src="https://i.imghippo.com/files/uafE3798xA.png"
            alt="Navig Logo"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-semibold">Portal do Motorista</h1>
          <p className="text-gray-600 mt-2">
            Entre ou crie sua conta para acessar o painel
          </p>
        </div>

        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Criar Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
          </TabsContent>
        </Tabs>

        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para página inicial
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default DriverLogin;