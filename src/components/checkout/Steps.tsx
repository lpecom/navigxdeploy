import { User, Calendar, CreditCard, ShieldCheck, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export const checkoutSteps = [
  { number: 1, title: "Seguro e Opcionais", icon: ShieldCheck },
  { number: 2, title: "Seus Dados", icon: User },
  { number: 3, title: "Escolher Plano", icon: Calendar },
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
                <div className="absolute w-full h-0.5 bg-gray-800/50 top-5 -left-1/2 -z-10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500/80 to-primary-600"
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}

              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive || isCompleted 
                    ? 'bg-gradient-to-br from-primary-500/90 via-primary-600 to-primary-700 shadow-lg shadow-primary-500/20' 
                    : 'bg-gray-800/50 backdrop-blur-sm'
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon className={`w-5 h-5 ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`} />
              </motion.div>

              <motion.span
                className={`mt-2 text-sm font-medium ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : isCompleted 
                      ? 'text-gray-300' 
                      : 'text-gray-500'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {step.title}
              </motion.span>
              
              <motion.span
                className={`text-xs ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent' 
                    : isCompleted 
                      ? 'text-green-400' 
                      : 'text-gray-600'
                }`}
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