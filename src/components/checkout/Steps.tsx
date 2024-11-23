export const checkoutSteps = [
  {
    id: 1,
    name: "Proteção",
    description: "Escolha sua proteção"
  },
  {
    id: 2,
    name: "Adicionais",
    description: "Selecione os opcionais"
  },
  {
    id: 3,
    name: "Cadastro",
    description: "Seus dados"
  },
  {
    id: 4,
    name: "Agendamento",
    description: "Escolha a data"
  },
  {
    id: 5,
    name: "Pagamento",
    description: "Finalize seu pedido"
  },
  {
    id: 6,
    name: "Confirmação",
    description: "Pedido confirmado"
  }
];

interface StepsProps {
  steps: {
    id: number;
    name: string;
    description: string;
  }[];
  currentStep: number;
}

export const Steps = ({ steps, currentStep }: StepsProps) => {
  const progressPercent = (currentStep / steps.length) * 100;

  return (
    <div>
      <div className="relative rounded-full bg-gray-300 h-2">
        <div
          className="absolute h-2 bg-primary transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-4">
        {steps.map(step => (
          <div key={step.id} className="text-center">
            <h4 className="font-semibold">{step.name}</h4>
            <p className="text-sm text-gray-500">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
