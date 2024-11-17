import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RotateCw, Gauge } from "lucide-react";
import { DiagnosticMetrics } from "./diagnostic/DiagnosticMetrics";
import { DiagnosticCodes } from "./diagnostic/DiagnosticCodes";
import { DiagnosticData } from "./bluetooth/types";

interface VehicleDiagnosticsProps {
  driverId: string;
}

export const VehicleDiagnostics = ({ driverId }: VehicleDiagnosticsProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData>({
    mileage: 0,
    fuelLevel: 0,
    engineTemp: 0,
    engineRpm: 0,
    vehicleSpeed: 0,
    throttlePosition: 0,
    diagnosticCodes: [],
  });
  const { toast } = useToast();

  const connectToOBD = async () => {
    if (!navigator.bluetooth) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Bluetooth não está disponível neste navegador.",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['FFE0'] }],
      });

      toast({
        title: "Conectando ao dispositivo...",
        description: "Por favor, aguarde.",
      });

      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService('FFE0');
      const characteristic = await service?.getCharacteristic('FFE1');

      if (characteristic) {
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', 
          (event: { target: { value: DataView } }) => {
            // Handle OBD data
            const value = event.target.value;
            if (!value) return;
            
            // Process the OBD response and update state
            // This is a simplified example
            setDiagnosticData(prev => ({
              ...prev,
              // Update with actual parsed values
            }));
          }
        );
        
        toast({
          title: "Conectado com sucesso!",
          description: "O dispositivo OBD está pronto para uso.",
        });
      }
    } catch (error) {
      console.error('Error connecting to OBD:', error);
      toast({
        variant: "destructive",
        title: "Erro ao conectar",
        description: "Não foi possível conectar ao dispositivo OBD.",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const runDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      // Simulate diagnostic run - replace with actual OBD commands
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: "Diagnóstico concluído",
        description: "Os dados foram salvos com sucesso.",
      });
    } catch (error) {
      console.error('Error running diagnostic:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível completar o diagnóstico.",
      });
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Diagnóstico do Veículo</h1>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={connectToOBD}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              "Conectar OBD"
            )}
          </Button>
          <Button
            onClick={runDiagnostic}
            disabled={isRunningDiagnostic}
          >
            {isRunningDiagnostic ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Executando...
              </>
            ) : (
              "Executar Diagnóstico"
            )}
          </Button>
        </div>
      </div>

      <DiagnosticMetrics data={diagnosticData} />
      <DiagnosticCodes codes={diagnosticData.diagnosticCodes} />
    </div>
  );
};