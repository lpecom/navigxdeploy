import { User, Calendar, ShieldCheck, CheckCircle, Package, LayoutDashboard, Wallet } from "lucide-react"
import { motion } from "framer-motion"

export const checkoutSteps = [
  { number: 1, title: "Visão Geral", icon: LayoutDashboard },
  { number: 2, title: "Planos", icon: Wallet },
  { number: 3, title: "Seguro e Proteção", icon: ShieldCheck },
  { number: 4, title: "Opcionais", icon: Package },
  { number: 5, title: "Seus Dados", icon: User },
  { number: 6, title: "Agendamento", icon: Calendar },
  { number: 7, title: "Confirmação", icon: CheckCircle }
]

interface StepsProps {
  currentStep: number;
  steps: typeof checkoutSteps;
}

export const Steps = ({ currentStep, steps }: StepsProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto overflow-x-auto">
      <div className="flex justify-between min-w-[700px] sm:min-w-0 relative px-4 sm:px-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              {index > 0 && (
                <div className="absolute w-full h-1 bg-gray-200 dark:bg-gray-800 top-5 -left-1/2 -z-10">
                  <motion.div
                    className={`h-full transition-all duration-300 ${isCompleted ? "bg-primary" : "bg-transparent"}`}
                  />
                </div>
              )}

              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  isActive || isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <motion.span
                className={`mt-2 text-xs sm:text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {step.title}
              </motion.span>
              
              <motion.span
                className="text-[10px] sm:text-xs text-gray-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isCompleted ? "Concluído" : isActive ? "Em Andamento" : "Pendente"}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};