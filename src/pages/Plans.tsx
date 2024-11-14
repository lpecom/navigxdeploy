import { useNavigate } from "react-router-dom";
import { PlanCard } from "@/components/plans/PlanCard";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

const Plans = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toast } = useToast();
  const selectedCar = JSON.parse(sessionStorage.getItem('selectedCar') || '{}');

  const handlePlanSelect = (planType: 'flex' | 'monthly' | 'black') => {
    if (!selectedCar) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um carro primeiro.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    // Add the car to cart with the selected plan
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: `${selectedCar.category}-${planType}`,
        type: 'car',
        quantity: 1,
        unitPrice: parseFloat(selectedCar.price),
        totalPrice: parseFloat(selectedCar.price),
        name: `${selectedCar.category} - Plano ${planType}`
      }
    });

    // Store plan selection in session
    sessionStorage.setItem('selectedPlan', planType);

    // Navigate to checkout
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Escolha seu plano</h1>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <PlanCard
            type="flex"
            price="529,00"
            onSelect={() => handlePlanSelect('flex')}
          />
          <div className="transform hover:scale-105 transition-transform duration-300">
            <PlanCard
              type="black"
              price="1299,00"
              onSelect={() => handlePlanSelect('black')}
            />
          </div>
          <PlanCard
            type="monthly"
            price="729,00"
            onSelect={() => handlePlanSelect('monthly')}
          />
        </div>
      </div>
    </div>
  );
};

export default Plans;