import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, GaugeCircle, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { CarModel } from "@/types/vehicles";
import { useNavigate } from "react-router-dom";

interface VehicleCardProps {
  vehicle: CarModel;
  index: number;
}

export const VehicleCard = ({ vehicle, index }: VehicleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [paymentOption, setPaymentOption] = useState("pay-now");
  const navigate = useNavigate();

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
        className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 cursor-pointer transition-all duration-300 ${
          isExpanded ? 'col-span-2' : ''
        }`}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            {vehicle.name}
          </h3>
          <p className="text-gray-400 text-sm">
            or similar | {vehicle.vehicle_type || 'Sedan'}
          </p>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden">
          {vehicle.image_url ? (
            <img
              src={vehicle.image_url}
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{vehicle.passengers || 5}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{vehicle.luggage || 2}</span>
            </div>
            <div className="flex items-center gap-2">
              <GaugeCircle className="h-4 w-4" />
              <span>Auto</span>
            </div>
            <div className="flex items-center gap-2">
              <DoorOpen className="h-4 w-4" />
              <span>4 Doors</span>
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
                  <h4 className="text-lg font-semibold text-white mb-4">Booking Options</h4>
                  <RadioGroup 
                    value={paymentOption} 
                    onValueChange={setPaymentOption}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="pay-now" id="pay-now" />
                      <Label htmlFor="pay-now" className="flex-1 cursor-pointer">
                        <div className="text-white font-medium">Best Price</div>
                        <div className="text-gray-400 text-sm">Pay now, cancel and rebook for a fee</div>
                      </Label>
                      <span className="text-white font-medium">Included</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 bg-white/5 p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <RadioGroupItem value="pay-later" id="pay-later" />
                      <Label htmlFor="pay-later" className="flex-1 cursor-pointer">
                        <div className="text-white font-medium">Stay Flexible</div>
                        <div className="text-gray-400 text-sm">Pay at pick-up, free cancellation</div>
                      </Label>
                      <span className="text-white font-medium">+$1/day</span>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">
                      ${vehicle.daily_price?.toFixed(2)}
                    </span>
                    <span className="text-gray-400 text-sm">/day</span>
                  </div>
                  <div className="space-x-3">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsExpanded(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleContinue}>
                      Continue
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