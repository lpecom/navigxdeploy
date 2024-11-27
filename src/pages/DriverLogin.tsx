import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from "@/components/auth/LoginTab";
import { SignupTab } from "@/components/auth/SignupTab";
import { supabase } from "@/integrations/supabase/client";

const DriverLogin = () => {
  const navigate = useNavigate();
  
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
            <LoginTab />
          </TabsContent>

          <TabsContent value="signup">
            <SignupTab />
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