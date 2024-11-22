import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

interface InsuranceSelectionProps {
  onSelect: (insuranceId: string) => void;
}

export const InsuranceSelection = ({ onSelect }: InsuranceSelectionProps) => {
  const { dispatch } = useCart();
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

  const handleInsuranceSelect = async (insurance: any) => {
    try {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: insurance.id,
          type: 'insurance',
          name: insurance.name,
          quantity: 1,
          unitPrice: insurance.price,
          totalPrice: insurance.price
        }
      });

      onSelect(insurance.id);
      
      toast({
        title: "Seguro selecionado",
        description: "O seguro foi adicionado ao seu pedido.",
      });
    } catch (error) {
      console.error('Error selecting insurance:', error);
      toast({
        title: "Erro ao selecionar seguro",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Escolha sua proteção</h2>
        <p className="text-muted-foreground mt-2">
          Selecione o seguro que melhor atende suas necessidades
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insuranceOptions?.map((insurance) => (
          <motion.div
            key={insurance.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="cursor-pointer hover:border-primary transition-colors">
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">{insurance.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground">
                  {insurance.description}
                </p>

                <div className="space-y-2">
                  {Object.entries(insurance.coverage_details).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{key}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <p className="text-2xl font-bold">
                    R$ {insurance.price.toFixed(2)}
                  </p>
                </div>

                <Button 
                  onClick={() => handleInsuranceSelect(insurance)}
                  className="w-full"
                >
                  Selecionar
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};