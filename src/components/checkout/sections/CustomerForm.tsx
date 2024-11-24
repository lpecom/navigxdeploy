import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { PersonalInfoFields } from "./form/PersonalInfoFields"

const customerSchema = z.object({
  first_name: z.string().min(2, "Nome é obrigatório"),
  last_name: z.string().min(2, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(11, "Telefone inválido").max(11, "Telefone inválido"),
  cpf: z.string().min(11, "CPF inválido").max(11, "CPF inválido"),
  is_over_25: z.boolean().refine((val) => val === true, {
    message: "Você precisa ter 25 anos ou mais para alugar",
  })
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormProps {
  onSubmit: (data: CustomerFormValues) => void;
}

export const CustomerForm = ({ onSubmit }: CustomerFormProps) => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      cpf: "",
      is_over_25: false
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-black/40 backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-semibold mb-6 text-white">Quem vai dirigir?</h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PersonalInfoFields form={form} />
          </form>
        </Form>
      </Card>
    </motion.div>
  )
}