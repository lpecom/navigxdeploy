export const checkoutSteps = [
  {
    id: 1,
    name: "Categoria",
    description: "Escolha a categoria do veículo",
  },
  {
    id: 2,
    name: "Plano",
    description: "Selecione o plano ideal",
  },
  {
    id: 3,
    name: "Seguro",
    description: "Escolha a proteção",
  },
  {
    id: 4,
    name: "Dados",
    description: "Preencha seus dados",
  },
  {
    id: 5,
    name: "Pagamento",
    description: "Finalize seu pedido",
  },
];

export const Steps = ({ currentStep, steps }) => {
  return (
    <div className="flex space-x-4">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full ${
              step.id <= currentStep ? "bg-primary" : "bg-gray-400"
            }`}
          >
            {step.id <= currentStep ? (
              <span className="text-white">{step.id}</span>
            ) : (
              <span className="text-gray-200">{step.id}</span>
            )}
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium">{step.name}</h4>
            <p className="text-sm text-gray-500">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
