import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/CartContext"

interface AuthSectionProps {
  form: any;
  hasAccount: boolean;
  onHasAccountChange: (checked: boolean) => void;
  onLogin: (email: string, password: string) => void;
  isLoggingIn: boolean;
}

export const AuthSection = ({ 
  form, 
  hasAccount, 
  onHasAccountChange, 
  onLogin, 
  isLoggingIn 
}: AuthSectionProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const { state: cartState } = useCart()

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent form bubbling
    
    try {
      if (cartState.items.length === 0 && !cartState.checkoutSessionId) {
        toast({
          title: "Carrinho vazio",
          description: "Adicione itens ao carrinho antes de fazer login.",
          variant: "destructive",
        })
        return
      }

      onLogin(email, password)
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: "Erro no login",
        description: error.message || "Falha ao realizar login",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6 mb-6">
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
          onCheckedChange={(checked) => onHasAccountChange(checked as boolean)}
          className="data-[state=checked]:bg-primary"
        />
        <label
          htmlFor="has_account"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Já tenho uma conta Navig
        </label>
      </div>

      {hasAccount ? (
        <div className="space-y-4">
          <div>
            <FormLabel className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <FormLabel className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Senha
            </FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button 
            onClick={handleLoginSubmit}
            className="w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Entrando...</span>
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Crie uma senha
                </FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Mínimo 6 caracteres"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </Card>
  )
}