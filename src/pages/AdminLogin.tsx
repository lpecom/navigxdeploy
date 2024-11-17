import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type DriverDetails = Database['public']['Tables']['driver_details']['Row'];

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First attempt to sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos. Por favor, verifique suas credenciais.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Falha na autenticação');
      }

      // Then check if the user exists in driver_details
      const { data: driverDetails, error: driverCheckError } = await supabase
        .from('driver_details')
        .select('id, crm_status')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (driverCheckError) {
        throw new Error('Erro ao verificar perfil do motorista. Por favor, tente novamente.');
      }

      if (!driverDetails) {
        // If authentication succeeded but no driver profile exists
        await supabase.auth.signOut(); // Sign out the authenticated user
        throw new Error('Perfil de motorista não encontrado para este email.');
      }

      // Update auth_user_id if not already set
      const { error: updateError } = await supabase
        .from('driver_details')
        .update({ auth_user_id: authData.user.id })
        .eq('id', driverDetails.id)
        .is('auth_user_id', null);

      if (updateError && !updateError.message.includes('duplicate key value')) {
        console.error('Error updating driver details:', updateError);
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo!",
      });
      
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas. Por favor, verifique seus dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <img
            src="https://i.imghippo.com/files/uafE3798xA.png"
            alt="Navig Logo"
            className="h-12 mx-auto"
          />
          <h1 className="text-2xl font-semibold">Painel Administrativo</h1>
          <p className="text-gray-600">
            Entre com suas credenciais para acessar o painel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Entrando...</span>
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;