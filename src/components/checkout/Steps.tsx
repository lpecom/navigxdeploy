import { User, Calendar, ShieldCheck, CheckCircle, Package, LayoutDashboard, Wallet } from "lucide-react"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

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
  const progress = (currentStep / steps.length) * 100;
  const currentStepData = steps[currentStep - 1];
  const Icon = currentStepData?.icon;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="bg-primary/10 text-primary rounded-full p-1.5">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <span className="text-sm font-medium text-primary">
          {currentStepData?.title}
        </span>
        <span className="text-xs text-muted-foreground ml-auto">
          Etapa {currentStep} de {steps.length}
        </span>
      </div>
      
      <Progress value={progress} className="h-1.5" />
      
      <motion.div 
        className="flex justify-between mt-1.5 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {steps.map((step) => (
          <motion.div
            key={step.number}
            className={`w-2 h-2 rounded-full ${
              step.number === currentStep
                ? 'bg-primary scale-125'
                : step.number < currentStep
                ? 'bg-primary'
                : 'bg-gray-200'
            }`}
            initial={false}
            animate={{
              scale: step.number === currentStep ? 1.25 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
};