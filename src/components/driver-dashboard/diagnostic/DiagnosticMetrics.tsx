import { Activity, Droplet, Gauge, Power, Thermometer } from "lucide-react";
import { DiagnosticCard } from "./DiagnosticCard";
import { DiagnosticData } from "../bluetooth/types";

interface DiagnosticMetricsProps {
  data: DiagnosticData;
}

export const DiagnosticMetrics = ({ data }: DiagnosticMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DiagnosticCard
        title="Quilometragem"
        value={`${data.mileage} km`}
        icon={Gauge}
      />
      <DiagnosticCard
        title="Nível de Combustível"
        value={`${data.fuelLevel}%`}
        icon={Droplet}
      />
      <DiagnosticCard
        title="Temperatura do Motor"
        value={`${data.engineTemp}°C`}
        icon={Thermometer}
      />
      <DiagnosticCard
        title="RPM do Motor"
        value={data.engineRpm}
        icon={Activity}
      />
      <DiagnosticCard
        title="Velocidade"
        value={`${data.vehicleSpeed} km/h`}
        icon={Gauge}
      />
      <DiagnosticCard
        title="Posição do Acelerador"
        value={`${data.throttlePosition}%`}
        icon={Power}
      />
    </div>
  );
};