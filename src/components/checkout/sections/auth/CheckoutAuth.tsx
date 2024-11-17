import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Lock, Mail } from "lucide-react"

interface CheckoutAuthProps {
  onLoginSuccess: (userId: string) => void;
}

export const CheckoutAuth = ({ onLoginSuccess }: CheckoutAuthProps) => {
  const [hasAccount, setHasAccount] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        })
        onLoginSuccess(data.user.id)
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-white to-blue-50">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Conta Navig</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        {hasAccount 
          ? "Faça login na sua conta Navig para continuar" 
          : "Crie uma conta Navig para acessar o painel do motorista e gerenciar suas reservas"}
      </p>

      <div className="flex items-center space-x-2 mb-6">
        <Checkbox
          id="has_account"
          checked={hasAccount}
          onCheckedChange={(checked) => setHasAccount(checked as boolean)}
          className="data-[state=checked]:bg-primary"
        />
        <label
          htmlFor="has_account"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Já tenho uma conta Navig
        </label>
      </div>

      {hasAccount && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Lock className="w-4 h-4" />
              Senha
            </label>
            <Input
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
      )}
    </Card>
  )
}