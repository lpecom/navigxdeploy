import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const ContractTab = () => {
  const handleGenerateReport = () => {
    toast.success('Relatório gerado com sucesso');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Documentação</h3>
            <p className="text-sm text-muted-foreground">
              Gere e imprima os documentos necessários para o check-in
            </p>
          </div>

          <div className="grid gap-4">
            <Button
              onClick={handleGenerateReport}
              className="w-full group hover:bg-primary/90 transition-colors"
              variant="outline"
            >
              <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Gerar Relatório
            </Button>
            
            <Button 
              className="w-full group hover:bg-primary/90 transition-colors"
              variant="outline"
            >
              <Printer className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
              Imprimir Contrato
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Documentos Recentes</h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Nenhum documento gerado recentemente
              </p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};