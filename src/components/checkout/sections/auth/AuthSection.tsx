import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Lock, Mail } from "lucide-react"

interface AuthSectionProps {
  form: any;
  hasAccount: boolean;
  onHasAccountChange: (checked: boolean) => void;
}

export const AuthSection = ({ form, hasAccount, onHasAccountChange }: AuthSectionProps) => {
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
                {hasAccount ? "Senha da conta Navig" : "Crie uma senha"}
              </FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder={hasAccount ? "Digite sua senha" : "Mínimo 6 caracteres"}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  )
}