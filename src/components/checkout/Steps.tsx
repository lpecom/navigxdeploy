import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface Step {
  number: number
  title: string
  icon: LucideIcon
}

interface StepsProps {
  steps: Step[]
  currentStep: number
}

export const Steps = ({ steps, currentStep }: StepsProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = step.number === currentStep
          const isCompleted = step.number < currentStep

          return (
            <div key={step.number} className="flex flex-col items-center relative">
              {index > 0 && (
                <div 
                  className="absolute w-full h-1 bg-gray-200 top-5 -left-1/2 -z-10"
                >
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
              
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive || isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isActive || isCompleted ? 'rgb(0, 178, 255)' : 'rgb(229, 231, 235)'
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              
              <span className={`mt-2 text-sm font-medium ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}