import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Upload } from "lucide-react";

interface FleetHeaderActionsProps {
  onSync: () => Promise<void>;
  onExport: () => Promise<void>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isSyncing: boolean;
  isUploading: boolean;
}

export const FleetHeaderActions = ({
  onSync,
  onExport,
  onFileUpload,
  isSyncing,
  isUploading
}: FleetHeaderActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".csv"
        onChange={onFileUpload}
        className="hidden"
        id="fleet-file-upload"
      />
      <Button
        onClick={() => document.getElementById('fleet-file-upload')?.click()}
        disabled={isUploading}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Upload className={`w-4 h-4 ${isUploading ? 'animate-spin' : ''}`} />
        {isUploading ? 'Importando...' : 'Importar dados do template'}
      </Button>
      <Button
        onClick={onExport}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Exportar dados em template
      </Button>
      <Button
        onClick={onSync}
        disabled={isSyncing}
        variant="outline"
        className="flex items-center gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
        {isSyncing ? 'Sincronizando...' : 'Sincronizar Frota'}
      </Button>
    </div>
  );
};