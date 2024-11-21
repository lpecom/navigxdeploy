import { motion } from "framer-motion";
import { Search, Calendar, Car } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Escolha seu carro",
    description: "Explore nossa frota premium e encontre o carro perfeito para você."
  },
  {
    icon: Calendar,
    title: "Selecione as datas",
    description: "Escolha as datas de retirada e devolução que melhor se adequam a você."
  },
  {
    icon: Car,
    title: "Reserve agora",
    description: "Confirme sua reserva e aproveite a experiência de dirigir um carro premium."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4"
          >
            Como funciona
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Alugar um carro premium nunca foi tão fácil. Siga estes três passos simples.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-500/20 to-primary-500/20 transform -translate-y-1/2" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 text-center relative z-10 shadow-lg shadow-gray-100/50 border border-gray-100">
                <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
              
              {/* Step Number */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};