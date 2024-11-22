import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

interface FleetActionsProps {
  onExport: () => Promise<void>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isUploading: boolean;
}

export const FleetActions = ({
  onExport,
  onFileUpload,
  isUploading
}: FleetActionsProps) => {
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
        {isUploading ? 'Importando...' : 'Importar dados'}
      </Button>
      <Button
        onClick={onExport}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Exportar dados
      </Button>
    </div>
  );
};