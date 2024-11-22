import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/website/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const InsurancePage = () => {
  const navigate = useNavigate();
  const { state: cartState, dispatch } = useCart();
  const { toast } = useToast();

  const { data: insuranceOptions } = useQuery({
    queryKey: ['insurance-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_options')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!cartState.items.find(item => item.type === 'car_group')) {
      navigate('/plans');
    }
  }, [cartState.items, navigate]);

  const handleInsuranceSelect = (insurance: any) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: insurance.id,
        type: 'insurance',
        quantity: 1,
        unitPrice: insurance.price,
        totalPrice: insurance.price,
        name: insurance.name
      }
    });

    navigate('/checkout');
  };

  const handleSkip = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 pt-20 sm:pt-28 pb-8 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Escolha sua proteção</h1>
              <p className="text-muted-foreground">
                Selecione o seguro que melhor atende suas necessidades
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {insuranceOptions?.map((insurance) => (
                <motion.div
                  key={insurance.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 cursor-pointer hover:border-primary transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">{insurance.name}</h3>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {insurance.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {Object.entries(insurance.coverage_details).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{key}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-2xl font-bold mb-4">
                      R$ {insurance.price.toFixed(2)}
                    </div>

                    <Button 
                      onClick={() => handleInsuranceSelect(insurance)}
                      className="w-full"
                    >
                      Selecionar
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Pular esta etapa
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePage;