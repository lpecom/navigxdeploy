import { motion } from "framer-motion";
import { Check, X, Info, ChevronLeft, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

interface InsuranceOption {
  id: string;
  name: string;
  price: number;
  coverage_details: Record<string, boolean>;
}

interface InsurancePackageStepProps {
  onSelect: () => void;
  onBack: () => void;
}

export const InsurancePackageStep = ({ onSelect, onBack }: InsurancePackageStepProps) => {
  const { dispatch, state } = useCart();
  
  const { data: insuranceOptions } = useQuery({
    queryKey: ['insurance-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_options')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (error) {
        toast.error("Erro ao carregar opções de seguro");
        throw error;
      }
      return data as InsuranceOption[];
    }
  });

  const handleInsuranceSelect = (insurance: InsuranceOption) => {
    // Remove any existing insurance from cart
    const nonInsuranceItems = state.items.filter(item => item.type !== 'insurance');
    
    // Add new insurance to cart
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

    toast.success("Seguro selecionado com sucesso!");
    onSelect();
  };

  const renderStars = (count: number) => {
    return Array(3).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < count ? 'text-primary fill-primary' : 'text-gray-400'}`} 
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Qual pacote de proteção você precisa?
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insuranceOptions?.map((option, index) => {
          const isSelected = state.items.some(item => item.id === option.id && item.type === 'insurance');
          const coverageCount = Object.values(option.coverage_details).filter(Boolean).length;

          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`relative overflow-hidden p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                  isSelected 
                    ? 'bg-primary/10 border-primary/50 shadow-primary/20' 
                    : 'bg-gray-900/50 hover:bg-gray-900/60 border-gray-800'
                }`}
                onClick={() => handleInsuranceSelect(option)}
              >
                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
                    isSelected 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-600'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white m-auto" />}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{option.name}</h3>
                    <div className="flex gap-1">
                      {renderStars(Math.min(coverageCount, 3))}
                    </div>
                  </div>

                  <div className="py-2 px-3 bg-green-500/10 text-green-400 text-sm rounded-md inline-block">
                    Sem franquia
                  </div>

                  <div className="space-y-3">
                    {Object.entries(option.coverage_details).map(([coverage, included]) => (
                      <div key={coverage} className="flex items-start gap-3">
                        {included ? (
                          <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex items-center gap-2">
                          <span className={included ? 'text-gray-200' : 'text-gray-500'}>
                            {coverage.replace(/_/g, ' ')}
                          </span>
                          <button 
                            className="text-gray-400 hover:text-gray-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info(coverage.replace(/_/g, ' '), {
                                description: "Mais detalhes sobre esta cobertura estarão disponíveis em breve."
                              });
                            }}
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(option.price)}
                      <span className="text-sm font-normal text-gray-400 ml-1">/ dia</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
