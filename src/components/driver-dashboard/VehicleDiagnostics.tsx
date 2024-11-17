import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Activity,
  AlertCircle,
  Gauge,
  Thermometer,
  Droplet,
  Power,
  Speed,
  RotateCw,
} from "lucide-react";

interface VehicleDiagnosticsProps {
  driverId: string;
}

declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: {
        filters: Array<{ services: string[] }>;
      }): Promise<{
        gatt?: {
          connect(): Promise<{
            getPrimaryService(service: string): Promise<{
              getCharacteristic(characteristic: string): Promise<{
                startNotifications(): Promise<void>;
                addEventListener(
                  event: string,
                  callback: (event: { target: { value: DataView } }) => void
                ): void;
              }>;
            }>;
          }>;
        };
      }>;
    };
  }
}

export const VehicleDiagnostics = ({ driverId }: VehicleDiagnosticsProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState({
    mileage: 0,
    fuelLevel: 0,
    engineTemp: 0,
    engineRpm: 0,
    vehicleSpeed: 0,
    throttlePosition: 0,
    diagnosticCodes: [] as string[],
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
        filters: [{ services: ['FFE0'] }], // Common service UUID for ELM327
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
        characteristic.addEventListener('characteristicvaluechanged', handleOBDData);
        
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

  const handleOBDData = (event: { target: { value: DataView } }) => {
    // Parse OBD data and update state
    const value = event.target.value;
    if (!value) return;

    // This is a simplified example - in reality, you'd need to implement
    // proper PID requests and responses parsing
    setDiagnosticData(prev => ({
      ...prev,
      // Update with actual parsed values
    }));
  };

  const runDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      // Simulate diagnostic run - replace with actual OBD commands
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Store diagnostic data
      const { error } = await supabase
        .from('vehicle_diagnostics')
        .insert({
          driver_id: driverId,
          mileage: diagnosticData.mileage,
          fuel_level: diagnosticData.fuelLevel,
          engine_temp: diagnosticData.engineTemp,
          engine_rpm: diagnosticData.engineRpm,
          vehicle_speed: diagnosticData.vehicleSpeed,
          throttle_position: diagnosticData.throttlePosition,
          diagnostic_codes: diagnosticData.diagnosticCodes,
        });

      if (error) throw error;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quilometragem</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticData.mileage} km</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nível de Combustível</CardTitle>
            <Droplet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticData.fuelLevel}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperatura do Motor</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticData.engineTemp}°C</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RPM do Motor</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticData.engineRpm}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Velocidade</CardTitle>
            <Speed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticData.vehicleSpeed} km/h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posição do Acelerador</CardTitle>
            <Power className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diagnosticData.throttlePosition}%</div>
          </CardContent>
        </Card>
      </div>

      {diagnosticData.diagnosticCodes.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Códigos de Diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {diagnosticData.diagnosticCodes.map((code, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="font-mono">{code}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};