import { Card } from "@/components/ui/card";
import { Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PlateSearchForm } from "./plate-lookup/PlateSearchForm";
import { FipeSelectionForm } from "./plate-lookup/FipeSelectionForm";
import { VehicleInfoDisplay } from "./plate-lookup/VehicleInfoDisplay";
import { usePlateLookup } from "./plate-lookup/usePlateLookup";

export const PlateLookup = () => {
  const {
    plate,
    setPlate,
    isLoading,
    vehicleInfo,
    brands,
    selectedBrand,
    models,
    selectedModel,
    years,
    selectedYear,
    fipeData,
    handleSearch,
    handleBrandSelect,
    handleModelSelect,
    handleYearSelect,
  } = usePlateLookup();

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

          <PlateSearchForm
            plate={plate}
            isLoading={isLoading}
            onPlateChange={setPlate}
            onSearch={handleSearch}
          />

          <AnimatePresence>
            {vehicleInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* FIPE Selection */}
                <div className="space-y-4 p-4 rounded-lg bg-white/5">
                  <h3 className="text-lg font-medium text-white">Selecione o modelo exato:</h3>
                  
                  <FipeSelectionForm
                    brands={brands}
                    models={models}
                    years={years}
                    selectedBrand={selectedBrand}
                    selectedModel={selectedModel}
                    selectedYear={selectedYear}
                    onBrandSelect={handleBrandSelect}
                    onModelSelect={handleModelSelect}
                    onYearSelect={handleYearSelect}
                  />
                </div>

                <VehicleInfoDisplay
                  fipeData={fipeData}
                  vehicleInfo={vehicleInfo}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};