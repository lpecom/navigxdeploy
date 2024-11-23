import { motion } from "framer-motion";
import { DollarSign, Users, Truck, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Preço justo garantido",
    description: "Oferecemos as melhores condições do mercado, com transparência e sem surpresas."
  },
  {
    icon: Users,
    title: "Motoristas qualificados",
    description: "Nossa equipe de motoristas passa por rigoroso processo de seleção e treinamento."
  },
  {
    icon: Truck,
    title: "Entrega onde você estiver",
    description: "Entregamos seu carro no local de sua preferência, com toda comodidade que você merece."
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte 24 horas",
    description: "Nossa equipe está sempre disponível para ajudar você, 24 horas por dia, 7 dias por semana."
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80"
              alt="Carro Luxuoso"
              className="w-full h-auto rounded-2xl shadow-xl"
            />
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Content */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-sm font-medium text-primary-400 uppercase tracking-wider">
                POR QUE ESCOLHER A NAVIG
              </h2>
              <h3 className="text-4xl font-display font-semibold text-white leading-tight">
                A melhor experiência em aluguel de carros premium
              </h3>
            </motion.div>

            <div className="grid gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};