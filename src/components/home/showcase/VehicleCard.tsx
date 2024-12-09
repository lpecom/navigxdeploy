import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, GaugeCircle, DoorOpen, TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getBrandLogo, getBrandFromModel } from "@/utils/brandLogos";
import type { CarModel } from "@/types/vehicles";
import { useNavigate } from "react-router-dom";

interface VehicleCardProps {
  vehicle: CarModel;
  index: number;
  weeklyPrice: number | null;
  estimatedProfit: {
    min: number | null;
    max: number | null;
  };
}

export const VehicleCard = ({ vehicle, index, weeklyPrice, estimatedProfit }: VehicleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [paymentOption, setPaymentOption] = useState("pay-now");
  const navigate = useNavigate();
  const brandLogo = getBrandLogo(vehicle.name);
  const brandName = getBrandFromModel(vehicle.name);

  const handleContinue = () => {
    sessionStorage.setItem('selectedCar', JSON.stringify({
      ...vehicle,
      paymentOption
    }));
    navigate('/plans');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      layout
    >
      <div 
        onClick={() => !isExpanded && setIsExpanded(true)}
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 cursor-pointer transition-all duration-300 hover:border-gray-600/50 ${
          isExpanded ? 'col-span-2' : ''
        }`}
      >
        <div className="p-6 pb-4">
          <Badge 
            variant="outline" 
            className="mb-3 flex items-center gap-2 w-fit bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors"
          >
            {brandLogo && (
              <img 
                src={brandLogo} 
                alt={`${brandName} logo`} 
                className="w-5 h-5 object-contain brightness-0 invert"
              />
            )}
            <span className="text-xs font-medium">{brandName}</span>
          </Badge>
          <h3 className="text-xl font-semibold text-white mb-1">
            {vehicle.name}
          </h3>
        </div>

        <div className="relative aspect-[16/9] mx-4 mb-4 overflow-hidden rounded-lg">
          {vehicle.image_url ? (
            <img
              src={vehicle.image_url}
              alt={vehicle.name}
              className="w-full h-full object-contain p-2 transition-transform duration-700 hover:scale-102"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500">Imagem indisponível</span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-3 px-1">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/5">
              <Users className="h-5 w-5 text-primary-400 mb-2" />
              <span className="text-xs font-medium text-gray-300 text-center">{vehicle.passengers || 5} lugares</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/5">
              <Briefcase className="h-5 w-5 text-primary-400 mb-2" />
              <span className="text-xs font-medium text-gray-300 text-center">{vehicle.luggage || 2} malas</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/5">
              <GaugeCircle className="h-5 w-5 text-primary-400 mb-2" />
              <span className="text-xs font-medium text-gray-300 text-center">Automático</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/5">
              <DoorOpen className="h-5 w-5 text-primary-400 mb-2" />
              <span className="text-xs font-medium text-gray-300 text-center">4 portas</span>
            </div>
          </div>

          <div className="border-t border-gray-700/50 pt-4 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Wallet className="w-4 h-4" />
                <span className="text-sm font-medium">Valor Semanal</span>
              </div>
              <span className="text-xl font-bold text-white">
                R$ 450
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Lucro Estimado por Semana</span>
              </div>
              <div className="text-xl font-bold text-emerald-400">
                R$ 1.200
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 border-t border-gray-700/50 pt-6"
              >
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Opções de Reservas</h4>
                  <RadioGroup 
                    value={paymentOption} 
                    onValueChange={setPaymentOption}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="pay-now" id="pay-now" />
                      <Label htmlFor="pay-now" className="flex-1 cursor-pointer">
                        <div className="text-white font-medium">Melhor Preço</div>
                        <div className="text-gray-400 text-sm">Pague agora, cancele e reserte por uma taxa</div>
                      </Label>
                      <span className="text-white font-medium">Incluído</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="pay-later" id="pay-later" />
                      <Label htmlFor="pay-later" className="flex-1 cursor-pointer">
                        <div className="text-white font-medium">Mantenha Flexível</div>
                        <div className="text-gray-400 text-sm">Pague na retirada, cancelamento gratuito</div>
                      </Label>
                      <span className="text-white font-medium">+$1/dia</span>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-x-3">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsExpanded(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleContinue}>
                      Continuar
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};