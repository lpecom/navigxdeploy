import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

const DriverLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/driver");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Authentication failed');
      }

      // Find most recent driver details
      const { data: driverData, error: driverError } = await supabase
        .from('driver_details')
        .select('id, crm_status')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (driverError) throw driverError;

      if (!driverData) {
        throw new Error('No driver profile found for this email.');
      }

      // Update the auth_user_id if not already set
      const { error: updateError } = await supabase
        .from('driver_details')
        .update({ auth_user_id: authData.user.id })
        .eq('id', driverData.id)
        .is('auth_user_id', null);

      if (updateError && !updateError.message.includes('duplicate key value')) {
        console.error('Error updating driver details:', updateError);
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      navigate("/driver");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <img
            src="/navig-logo.png"
            alt="Navig Logo"
            className="h-12 mx-auto mb-4"
          />
          <h1 className="text-2xl font-semibold">Portal do Motorista</h1>
          <p className="text-gray-600 mt-2">
            Entre com suas credenciais para acessar o painel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

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