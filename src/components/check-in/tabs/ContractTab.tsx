import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { toast } from "sonner";

export const ContractTab = () => {
  const handleGenerateReport = () => {
    toast.success('Relatório gerado com sucesso');
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="font-medium">Documentação</h3>
        <div className="space-y-4">
          <Button
            onClick={handleGenerateReport}
            className="w-full"
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Gerar Relatório
          </Button>
          <Button className="w-full" variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir Contrato
          </Button>
        </div>
      </div>
    </Card>
  );
};