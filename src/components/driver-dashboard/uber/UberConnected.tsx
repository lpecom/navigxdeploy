import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, RefreshCw } from "lucide-react";
import { UberStats } from "./UberStats";

interface UberConnectedProps {
  driverId: string;
  onDisconnect: () => void;
  onSync: () => Promise<void>;
  isSyncing: boolean;
}

export const UberConnected = ({ 
  driverId,
  onDisconnect,
  onSync,
  isSyncing 
}: UberConnectedProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Conta Uber Conectada
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSync}
                disabled={isSyncing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDisconnect}
              >
                Desconectar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <UberStats driverId={driverId} />
        </CardContent>
      </Card>
    </div>
  );
};