import { motion } from "framer-motion";
import { MapPin, Calendar, Car } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Escolha sua região",
    description: "Selecione a região onde você atua para encontrar o melhor carro."
  },
  {
    icon: Calendar,
    title: "Defina seu plano",
    description: "Escolha o plano que melhor se adapta à sua rotina de trabalho."
  },
  {
    icon: Car,
    title: "Comece a lucrar",
    description: "Receba seu carro e comece a maximizar seus ganhos imediatamente."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-medium text-primary-600 mb-3 uppercase tracking-wider">
            COMO FUNCIONA
          </h2>
          <h3 className="text-4xl font-display font-semibold text-gray-900">
            Comece a lucrar em 3 passos simples
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-100 via-primary-500 to-primary-100" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 relative">
                  <step.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};