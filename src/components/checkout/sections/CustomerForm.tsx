import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DriverForm } from "@/components/driver/DriverForm"
import { driverSchema, type DriverFormValues } from "@/types/driver"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface CustomerFormProps {
  onSubmit: (driverId: string) => void
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  const { toast } = useToast()
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      licenseNumber: "",
      licenseExpiry: "",
      cpf: "",
      phone: "",
      email: "",
    },
  })

  const handleSubmit = async (data: DriverFormValues) => {
    try {
      // Create driver record with CRM status
      const { data: driverData, error: driverError } = await supabase
        .from("driver_details")
        .insert([
          {
            full_name: data.fullName,
            birth_date: data.birthDate,
            license_number: data.licenseNumber,
            license_expiry: data.licenseExpiry,
            cpf: data.cpf,
            phone: data.phone,
            email: data.email,
            crm_status: 'pending_payment'
          }
        ])
        .select()
        .single()

      if (driverError) throw driverError

      toast({
        title: "Sucesso!",
        description: "Seus dados foram salvos com sucesso.",
      })

      // Pass the driver ID back to parent component
      onSubmit(driverData.id)
    } catch (error: any) {
      console.error('Error submitting driver details:', error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar seus dados. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Informações do Condutor</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <DriverForm form={form} />
          <Button type="submit" className="w-full">
            Continuar para pagamento
          </Button>
        </form>
      </Form>
    </Card>
  )
}