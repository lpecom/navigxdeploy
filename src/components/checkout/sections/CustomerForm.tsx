import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useState, useCallback } from "react"
import { AuthSection } from "./auth/AuthSection"
import { PersonalInfoSection } from "./personal/PersonalInfoSection"
import { AddressSection } from "./address/AddressSection"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

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
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  })

  const handleAddressSelect = useCallback(async (postal_code: string) => {
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
  }, [form])

  const handleFormSubmit = async (data: CustomerFormValues) => {
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
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <AuthSection 
              form={form}
              hasAccount={hasAccount}
              onHasAccountChange={setHasAccount}
            />
            
            <PersonalInfoSection form={form} />
            
            <AddressSection 
              form={form}
              isLoadingAddress={isLoadingAddress}
              onPostalCodeChange={handleAddressSelect}
            />

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              Continuar
            </Button>
          </form>
        </Form>
      </Card>
    </motion.div>
  )
}