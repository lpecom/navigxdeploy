import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlanSelectionStepProps {
  onNext: () => void;
}

export const PlanSelectionStep = ({ onNext }: PlanSelectionStepProps) => {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const { data: carModels, isLoading } = useQuery({
    queryKey: ['car-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select(`
          *,
          category:categories(name)
        `);
      
      if (error) {
        toast.error('Erro ao carregar modelos');
        throw error;
      }
      
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white/5 backdrop-blur-sm border-white/10">
        <h2 className="text-xl font-semibold mb-4 text-white">Escolha seu plano</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carModels?.map((model) => (
            <Card
              key={model.id}
              className={`relative overflow-hidden p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                selectedModel === model.id
                  ? 'bg-primary/10 border-primary/50 shadow-primary/20'
                  : 'bg-gray-900/50 hover:bg-gray-900/60 border-gray-800'
              }`}
              onClick={() => handleModelSelect(model.id)}
            >
              {model.image_url && (
                <div className="relative h-40 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={model.image_url}
                    alt={model.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                {model.category && (
                  <p className="text-sm text-gray-400">{model.category.name}</p>
                )}
                
                {model.daily_price && (
                  <p className="text-2xl font-bold text-white">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(model.daily_price)}
                    <span className="text-sm font-normal text-gray-400 ml-1">/ dia</span>
                  </p>
                )}

                <div className="pt-4 space-y-2">
                  {model.features && Array.isArray(model.features) && model.features.map((feature: string, index: number) => (
                    <p key={index} className="text-sm text-gray-400">
                      • {feature}
                    </p>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={onNext}
            disabled={!selectedModel}
            className="bg-primary hover:bg-primary/90 text-white gap-1.5"
          >
            Continuar
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};