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
    <Card className="bg-gray-900/50 border-gray-800/50 backdrop-blur-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Conta Navig
        </h3>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        {hasAccount 
          ? "Faça login na sua conta Navig para continuar" 
          : "Crie uma conta Navig para acessar o painel do motorista e gerenciar suas reservas"}
      </p>

      <div className="flex items-center space-x-2 mb-6">
        <Checkbox
          id="has_account"
          checked={hasAccount}
          onCheckedChange={(checked) => onHasAccountChange(checked as boolean)}
          className="data-[state=checked]:bg-primary-500 border-gray-700"
        />
        <label
          htmlFor="has_account"
          className="text-sm font-medium text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Já tenho uma conta Navig
        </label>
      </div>

      {hasAccount ? (
        <div className="space-y-4">
          <div>
            <FormLabel className="flex items-center gap-2 text-gray-300">
              <Mail className="w-4 h-4 text-primary-400" />
              Email
            </FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
              required
            />
          </div>

          <div>
            <FormLabel className="flex items-center gap-2 text-gray-300">
              <Lock className="w-4 h-4 text-primary-400" />
              Senha
            </FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
              required
            />
          </div>

          <Button 
            onClick={handleLoginSubmit}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white"
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
                <FormLabel className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-primary-400" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-300">
                  <Lock className="w-4 h-4 text-primary-400" />
                  Crie uma senha
                </FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Mínimo 6 caracteres"
                    className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500"
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>
      )}
    </Card>
  )
}