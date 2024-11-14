import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DriverForm } from "@/components/driver/DriverForm"
import { driverSchema, type DriverFormValues } from "@/types/driver"

interface CustomerFormProps {
  onSubmit: (data: DriverFormValues) => void
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
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

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Informações do Condutor</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DriverForm form={form} />
          <Button type="submit" className="w-full">
            Continuar para pagamento
          </Button>
        </form>
      </Form>
    </Card>
  )
}