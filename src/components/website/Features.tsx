import { Shield, Clock, Smartphone, Car } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Veículos com seguro completo e assistência 24h"
  },
  {
    icon: Clock,
    title: "Rápido e Fácil",
    description: "Processo de aluguel simplificado e sem burocracia"
  },
  {
    icon: Smartphone,
    title: "App Exclusivo",
    description: "Gerencie suas reservas pelo nosso aplicativo"
  },
  {
    icon: Car,
    title: "Frota Premium",
    description: "Veículos novos e bem mantidos para sua segurança"
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Por que escolher a Navig?
          </h2>
          <p className="text-xl text-gray-600">
            Oferecemos o melhor serviço de aluguel de carros do Brasil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-navig/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-navig" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};