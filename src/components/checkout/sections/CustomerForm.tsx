import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AuthSection } from "./auth/AuthSection"
import { PersonalInfoSection } from "./personal/PersonalInfoSection"
import { AddressSection } from "./address/AddressSection"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/CartContext"

const customerSchema = z.object({
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional(),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  postal_code: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormProps {
  onSubmit: (data: CustomerFormValues & { auth_user_id?: string }) => void
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [hasAccount, setHasAccount] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { toast } = useToast()
  const { state: cartState } = useCart()
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  })

  const handleLogin = async (email: string, password: string) => {
    setIsLoggingIn(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (!user) {
        throw new Error('Authentication failed')
      }

      const { data: driverDetails, error: driverError } = await supabase
        .from('driver_details')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (driverError) throw driverError

      if (driverDetails) {
        onSubmit({
          full_name: driverDetails.full_name,
          email: driverDetails.email,
          cpf: driverDetails.cpf,
          phone: driverDetails.phone,
          address: driverDetails.address || '',
          city: driverDetails.city || '',
          state: driverDetails.state || '',
          postal_code: driverDetails.postal_code || '',
          auth_user_id: user.id
        })
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Suas informações foram carregadas automaticamente.",
        })
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: "Erro no login",
        description: error.message || "Falha ao realizar login",
        variant: "destructive",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleFormSubmit = async (data: CustomerFormValues) => {
    if (cartState.items.length === 0 && !cartState.checkoutSessionId) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de continuar.",
        variant: "destructive",
      })
      return
    }

    const { password, ...customerData } = data
    onSubmit(customerData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 shadow-sm">
        <Form {...form}>
          <div className="space-y-6">
            <AuthSection 
              form={form}
              hasAccount={hasAccount}
              onHasAccountChange={setHasAccount}
              onLogin={handleLogin}
              isLoggingIn={isLoggingIn}
            />
            
            {!hasAccount && (
              <>
                <PersonalInfoSection form={form} />
                <AddressSection 
                  form={form}
                  isLoadingAddress={isLoadingAddress}
                  onPostalCodeChange={async (postal_code: string) => {
                    setIsLoadingAddress(true)
                    try {
                      const response = await fetch(`https://viacep.com.br/ws/${postal_code}/json/`)
                      const data = await response.json()
                      
                      if (!data.erro) {
                        form.setValue('address', data.logradouro)
                        form.setValue('city', data.localidade)
                        form.setValue('state', data.uf)
                      }
                    } catch (error) {
                      console.error('Error fetching address:', error)
                    } finally {
                      setIsLoadingAddress(false)
                    }
                  }}
                />

                <Button 
                  onClick={form.handleSubmit(handleFormSubmit)}
                  className="w-full h-12 text-lg font-medium transition-all duration-200 hover:scale-[1.02]"
                >
                  Continuar
                </Button>
              </>
            )}
          </div>
        </Form>
      </Card>
    </motion.div>
  )
}