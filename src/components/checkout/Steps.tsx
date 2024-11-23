import { User, Calendar, CreditCard, ShieldCheck, CheckCircle, Package } from "lucide-react"

export const checkoutSteps = [
  { number: 1, title: "Seguro e Proteção", icon: ShieldCheck },
  { number: 2, title: "Opcionais", icon: Package },
  { number: 3, title: "Seus Dados", icon: User },
  { number: 4, title: "Agendamento", icon: Calendar },
  { number: 5, title: "Pagamento", icon: CreditCard },
  { number: 6, title: "Confirmação", icon: CheckCircle }
]
