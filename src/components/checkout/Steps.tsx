import { User, Calendar, CreditCard, ShieldCheck, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export const checkoutSteps = [
  { number: 1, title: "Escolher Plano", icon: Calendar },
  { number: 2, title: "Seguro e Opcionais", icon: ShieldCheck },
  { number: 3, title: "Seus Dados", icon: User },
  { number: 4, title: "Agendamento", icon: Calendar },
  { number: 5, title: "Pagamento", icon: CreditCard },
  { number: 6, title: "Confirmação", icon: CheckCircle }
]

interface StepsProps {
  currentStep: number;
  steps?: typeof checkoutSteps;
}

export const Steps = ({ currentStep, steps = checkoutSteps }: StepsProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              {index > 0 && (
                <div className="absolute w-full h-1 bg-gray-200 top-5 -left-1/2 -z-10">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}

              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                  isActive || isCompleted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isActive || isCompleted ? 'rgb(0, 178, 255)' : 'rgb(243, 244, 246)'
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>

              <motion.span
                className={`mt-2 text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {step.title}
              </motion.span>
              
              <motion.span
                className="text-xs text-gray-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {isCompleted ? "Completed" : isActive ? "In Progress" : "Pending"}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
};