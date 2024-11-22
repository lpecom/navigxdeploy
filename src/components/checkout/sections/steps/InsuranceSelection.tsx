import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check } from "lucide-react";
import { motion } from "framer-motion";

interface InsuranceSelectionProps {
  onSelect: (insuranceId: string) => void;
}

export const InsuranceSelection = ({ onSelect }: InsuranceSelectionProps) => {
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  {insurance.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                    onClick={() => onSelect(insurance.id)}
                    className="w-full"
                  >
                    Selecionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};