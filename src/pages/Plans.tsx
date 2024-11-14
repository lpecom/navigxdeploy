import { useNavigate } from "react-router-dom";
import { PlanCard } from "@/components/plans/PlanCard";

const Plans = () => {
  const navigate = useNavigate();
  const selectedCar = JSON.parse(sessionStorage.getItem('selectedCar') || '{}');

  const handlePlanSelect = () => {
    navigate('/optionals');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Escolha seu plano</h1>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PlanCard
            type="flex"
            price="529,00"
            onSelect={handlePlanSelect}
          />
          <PlanCard
            type="monthly"
            price="729,00"
            onSelect={handlePlanSelect}
          />
          <PlanCard
            type="black"
            price="1299,00"
            onSelect={handlePlanSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Plans;