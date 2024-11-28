import { Car, AlertCircle } from "lucide-react";

interface VehicleInfoDisplayProps {
  fipeData: any;
  vehicleInfo: any;
}

export const VehicleInfoDisplay = ({ fipeData, vehicleInfo }: VehicleInfoDisplayProps) => {
  if (!fipeData || !vehicleInfo) return null;

  return (
    <>
      {/* FIPE Data Display */}
      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center gap-3 text-white mb-3">
          <Car className="w-5 h-5" />
          <h3 className="font-semibold">Informações do Veículo</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Marca</p>
            <p className="text-white">{fipeData.brand}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Modelo</p>
            <p className="text-white">{fipeData.model}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Ano</p>
            <p className="text-white">{fipeData.modelYear}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Valor FIPE</p>
            <p className="text-white">{fipeData.price}</p>
          </div>
        </div>
      </div>
      
      {/* Fines Display */}
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
    </>
  );
};