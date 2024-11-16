import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLoadScript, Autocomplete } from "@react-google-maps/api"
import { useState, useCallback } from "react"
import { Loader2 } from "lucide-react"

const customerSchema = z.object({
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  postal_code: z.string().min(8, "CEP inválido").max(9, "CEP inválido"),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormProps {
  onSubmit: (data: CustomerFormValues) => void
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  })

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDjnhLdrsCZlcSjJemKCmjYqfqk11_nwM8",
    libraries: ["places"]
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

  if (!isLoaded) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Carregando...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Informações Pessoais</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome Completo</label>
              <Input {...form.register("full_name")} className="transition-all" />
              {form.formState.errors.full_name && (
                <p className="text-sm text-red-500">{form.formState.errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">CPF</label>
              <Input {...form.register("cpf")} />
              {form.formState.errors.cpf && (
                <p className="text-sm text-red-500">{form.formState.errors.cpf.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <Input {...form.register("phone")} />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">CEP</label>
            <Input 
              {...form.register("postal_code")}
              onChange={(e) => {
                form.register("postal_code").onChange(e)
                if (e.target.value.length === 8) {
                  handleAddressSelect(e.target.value)
                }
              }}
            />
            {isLoadingAddress && (
              <div className="flex items-center text-sm text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Buscando endereço...
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Endereço</label>
            <Input {...form.register("address")} />
            {form.formState.errors.address && (
              <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cidade</label>
              <Input {...form.register("city")} />
              {form.formState.errors.city && (
                <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Input {...form.register("state")} />
              {form.formState.errors.state && (
                <p className="text-sm text-red-500">{form.formState.errors.state.message}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full hover:scale-105 transition-transform"
            disabled={isLoadingAddress}
          >
            Continuar
          </Button>
        </form>
      </Form>
    </Card>
  )
}