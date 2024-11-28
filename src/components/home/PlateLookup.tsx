import { useState } from "react";
import { Search, Car, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export const PlateLookup = () => {
  const [plate, setPlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!plate.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma placa válida",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-vehicle-fines', {
        body: { plate }
      });

      if (error) throw error;

      if (data.fines?.length > 0 || data.fipeData) {
        setVehicleInfo(data);
        toast({
          title: "Sucesso",
          description: `Encontramos informações para esta placa`,
        });
      } else {
        toast({
          title: "Nenhuma informação encontrada",
          description: "Não encontramos multas ou dados do veículo para esta placa",
        });
      }
    } catch (error) {
      console.error('Error fetching vehicle info:', error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar informações do veículo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700/50">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-white">Consulta de Placa</h2>
            <p className="text-gray-400">
              Digite a placa do veículo para consultar informações
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="ABC1234"
              className="bg-white/10 border-gray-700 text-white placeholder:text-gray-500"
              maxLength={7}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="w-4 h-4" />
                </motion.div>
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>

          <AnimatePresence>
            {vehicleInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {vehicleInfo.fipeData && (
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 text-white mb-3">
                      <Car className="w-5 h-5" />
                      <h3 className="font-semibold">Informações do Veículo</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Marca</p>
                        <p className="text-white">{vehicleInfo.fipeData.brand}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Modelo</p>
                        <p className="text-white">{vehicleInfo.fipeData.model}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Ano</p>
                        <p className="text-white">{vehicleInfo.fipeData.year}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Valor FIPE</p>
                        <p className="text-white">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(vehicleInfo.fipeData.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {vehicleInfo.fines?.map((fine: any, index: number) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm">{fine.description}</p>
                        <div className="flex gap-4 mt-1 text-xs text-gray-400">
                          <span>Data: {new Date(fine.date).toLocaleDateString()}</span>
                          <span>Valor: R$ {fine.amount.toFixed(2)}</span>
                          <span>Pontos: {fine.points}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{fine.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};