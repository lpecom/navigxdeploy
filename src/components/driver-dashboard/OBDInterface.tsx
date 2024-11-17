import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bluetooth } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BluetoothRemoteGATTCharacteristic, BluetoothDevice } from "./bluetooth/types";

interface OBDData {
  rpm?: number;
  speed?: number;
  coolantTemp?: number;
  fuelLevel?: number;
}

export const OBDInterface = () => {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [obdData, setOBDData] = useState<OBDData>({});
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

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['FFE0'] }]
      });

      toast({
        title: "Conectando ao dispositivo...",
        description: "Por favor, aguarde.",
      });

      const server = await device.gatt?.connect();
      const service = await server?.getPrimaryService('FFE0');
      const characteristic = await service?.getCharacteristic('FFE1');

      if (characteristic) {
        setDevice(device);
        setCharacteristic(characteristic);
        
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', 
          (event: { target: { value: DataView } }) => {
            handleOBDData(event);
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
    }
  };

  const handleOBDData = (event: { target: { value: DataView } }) => {
    const value = event.target.value;
    if (!value) return;

    // Parse the received data
    const decoder = new TextDecoder('utf-8');
    const data = decoder.decode(value);
    
    // Process the OBD response and update state
    parseOBDResponse(data);
  };

  const parseOBDResponse = (data: string) => {
    setOBDData(prevData => ({
      ...prevData,
      // Add parsed values here
    }));
  };

  const disconnect = async () => {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
      setDevice(null);
      setCharacteristic(null);
      setOBDData({});
      
      toast({
        title: "Desconectado",
        description: "Dispositivo OBD desconectado com sucesso.",
      });
    }
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bluetooth className="h-5 w-5" />
          Interface OBD
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!device ? (
          <div className="text-center">
            <Button onClick={connectToOBD}>
              Conectar ao Dispositivo OBD
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Certifique-se de que seu dispositivo OBD está ligado e pareado com o Bluetooth
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/5">
                <div className="text-sm font-medium">RPM</div>
                <div className="text-2xl font-bold">{obdData.rpm || '---'}</div>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <div className="text-sm font-medium">Velocidade</div>
                <div className="text-2xl font-bold">{obdData.speed || '---'} km/h</div>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <div className="text-sm font-medium">Temperatura</div>
                <div className="text-2xl font-bold">{obdData.coolantTemp || '---'}°C</div>
              </div>
              <div className="p-4 rounded-lg bg-primary/5">
                <div className="text-sm font-medium">Nível de Combustível</div>
                <div className="text-2xl font-bold">{obdData.fuelLevel || '---'}%</div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={disconnect}>
                Desconectar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};