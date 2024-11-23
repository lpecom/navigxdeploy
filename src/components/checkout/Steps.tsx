import { User, Calendar, CreditCard, ShieldCheck, CheckCircle, Package } from "lucide-react"

export const checkoutSteps = [
  { number: 1, title: "Seguro e Proteção", icon: ShieldCheck },
  { number: 2, title: "Opcionais", icon: Package },
  { number: 3, title: "Seus Dados", icon: User },
  { number: 4, title: "Agendamento", icon: Calendar },
  { number: 5, title: "Pagamento", icon: CreditCard },
  { number: 6, title: "Confirmação", icon: CheckCircle }
]

interface StepsProps {
  currentStep: number;
  steps: typeof checkoutSteps;
}

export const Steps = ({ currentStep, steps }: StepsProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              {index > 0 && (
                <div className="absolute w-full h-1 bg-gray-200 dark:bg-gray-800 top-5 -left-1/2 -z-10">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isCompleted ? "bg-primary" : "bg-transparent"
                    }`}
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

              <span
                className={`mt-2 text-sm font-medium ${
                  isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};