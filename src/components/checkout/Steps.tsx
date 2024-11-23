import { Car, Shield, Package2, User, Calendar, CreditCard, CheckCircle } from "lucide-react";

export const checkoutSteps = [
  {
    number: 1,
    title: "Plano",
    icon: Car,
  },
  {
    number: 2,
    title: "Seguro e Proteção",
    icon: Shield,
  },
  {
    number: 3,
    title: "Opcionais",
    icon: Package2,
  },
  {
    number: 4,
    title: "Seus Dados",
    icon: User,
  },
  {
    number: 5,
    title: "Agendamento",
    icon: Calendar,
  },
  {
    number: 6,
    title: "Pagamento",
    icon: CreditCard,
  },
  {
    number: 7,
    title: "Confirmação",
    icon: CheckCircle,
  },
];

export type Steps = typeof checkoutSteps;