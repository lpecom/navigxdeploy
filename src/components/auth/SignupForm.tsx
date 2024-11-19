import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SignupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Failed to create account');
      }

      const { error: driverError } = await supabase
        .from('driver_details')
        .insert([
          {
            full_name: fullName,
            email,
            cpf,
            phone,
            auth_user_id: authData.user.id,
            birth_date: new Date().toISOString(),
            license_number: 'PENDING',
            license_expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ]);

      if (driverError) throw driverError;

      toast({
        title: "Conta criada com sucesso",
        description: "Você será redirecionado para completar seu cadastro.",
      });

      navigate("/driver");
    } catch (error: any) {
      console.error('Signup error:', error);
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
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="signup-name" className="block text-sm font-medium">
          Nome Completo
        </label>
        <Input
          id="signup-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="João da Silva"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-email" className="block text-sm font-medium">
          Email
        </label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-cpf" className="block text-sm font-medium">
          CPF
        </label>
        <Input
          id="signup-cpf"
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="000.000.000-00"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-phone" className="block text-sm font-medium">
          Telefone
        </label>
        <Input
          id="signup-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="(11) 99999-9999"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-password" className="block text-sm font-medium">
          Senha
        </label>
        <Input
          id="signup-password"
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
        {isLoading ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
};