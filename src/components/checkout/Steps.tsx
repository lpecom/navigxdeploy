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
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center gap-8">
        {steps.map((step) => (
          <li key={step.id} className="flex-1">
            <div className="flex flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step.id === currentStep
                  ? "border-primary bg-primary text-white"
                  : step.id < currentStep
                  ? "border-primary bg-primary text-white"
                  : "border-white/20 bg-white/5"
              }`}>
                <span className="text-sm font-medium">{step.id}</span>
              </div>
              <div className="mt-2 flex flex-col items-center">
                <span className={`text-sm font-medium ${
                  step.id <= currentStep ? "text-white" : "text-white/60"
                }`}>
                  {step.name}
                </span>
                <span className={`text-xs ${
                  step.id <= currentStep ? "text-white/80" : "text-white/40"
                }`}>
                  {step.description}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};