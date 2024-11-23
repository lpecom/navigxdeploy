import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Users, Briefcase, GaugeCircle, DoorOpen } from "lucide-react";
import type { CarModel } from "@/types/vehicles";

interface VehicleDetailsProps {
  vehicle: CarModel;
  onClose: () => void;
  open: boolean;
}

const VehicleDetails = ({ vehicle, onClose, open }: VehicleDetailsProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-0">
        <div className="relative flex flex-col md:flex-row">
          <div className="relative w-full md:w-3/5 aspect-[16/9] md:aspect-auto">
            {vehicle.image_url ? (
              <img
                src={vehicle.image_url}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          <div className="p-6 md:p-8 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">{vehicle.name}</h3>
                <p className="text-gray-400">or similar | {vehicle.vehicle_type || 'Sedan'}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="h-5 w-5" />
                <span>{vehicle.passengers || 5} Seats</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Briefcase className="h-5 w-5" />
                <span>{vehicle.luggage || 2} Suitcase(s)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <GaugeCircle className="h-5 w-5" />
                <span>{vehicle.transmission || 'Automatic'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <DoorOpen className="h-5 w-5" />
                <span>4 Doors</span>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold text-white">
                  ${vehicle.daily_price?.toFixed(2)}
                </span>
                <span className="text-gray-400">/day</span>
              </div>
              
              <Button 
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                size="lg"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const VehicleShowcase = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<CarModel | null>(null);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['showcase-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('car_models')
        .select(`
          *,
          category:categories(name)
        `)
        .order('name')
        .limit(3);
      
      if (error) throw error;
      return data as CarModel[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="h-[400px] bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Which car do you want to drive?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose from our selection of premium vehicles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles?.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedVehicle(vehicle)}
              className="cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50">
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
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">
                        ${vehicle.daily_price?.toFixed(2)}
                      </span>
                      <span className="text-gray-400 text-sm">/day</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      ${(vehicle.daily_price || 0) * 30} total
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedVehicle && (
            <VehicleDetails
              vehicle={selectedVehicle}
              onClose={() => setSelectedVehicle(null)}
              open={!!selectedVehicle}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};