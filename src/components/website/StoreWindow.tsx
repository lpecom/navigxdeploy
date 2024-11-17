import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Fuel, Gauge, Car } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CarSpecs {
  passengers: number;
  transmission: string;
  consumption: string;
  plan: string;
}

interface SelectedCar {
  id: string;
  name: string;
  category: string;
  price: number;
  period: string;
  image_url: string;
  specs: CarSpecs;
}

interface StoreWindowProps {
  selectedCar: SelectedCar;
}

export const StoreWindow = ({ selectedCar }: StoreWindowProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelect = () => {
    sessionStorage.setItem('selectedCar', JSON.stringify(selectedCar));
    navigate('/plans');
  };

  return (
    <Card className="overflow-hidden bg-white shadow-xl rounded-xl">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-[16/9] rounded-lg overflow-hidden"
        >
          <img
            src={selectedCar.image_url || '/placeholder.svg'}
            alt={selectedCar.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </motion.div>

        <div className="flex flex-col justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold mb-2">{selectedCar.name}</h3>
              <p className="text-gray-600 mb-6">{selectedCar.category}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{selectedCar.specs.passengers} lugares</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{selectedCar.specs.transmission}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{selectedCar.specs.consumption}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{selectedCar.specs.plan}</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">R$ {selectedCar.price}</span>
              <span className="text-gray-600">/{selectedCar.period}</span>
            </div>
            <Button 
              onClick={handleSelect}
              className="w-full"
              size="lg"
            >
              Selecionar
            </Button>
          </motion.div>
        </div>
      </div>
    </Card>
  );
};