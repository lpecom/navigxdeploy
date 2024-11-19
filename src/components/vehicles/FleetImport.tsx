import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

export const FleetImport = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const processFleetData = async () => {
    setIsProcessing(true);
    setProgress(10);

    try {
      const { data, error } = await supabase.functions.invoke(
        "process-fleet-csv",
        {
          body: { 
            csvUrl: 'https://raw.githubusercontent.com/navigcars/fleet/main/fleet.csv',
            importDate: new Date().toISOString()
          },
        }
      );

      if (error) {
        console.error("Error details:", error);
        throw error;
      }

      setProgress(100);
      console.log("Import response:", data);

      toast({
        title: "Sucesso!",
        description: `Frota atualizada com sucesso. ${data.processed} veículos processados.`,
      });

      // Force a page refresh to show the new data
      window.location.reload();
    } catch (error) {
      console.error("Error processing fleet data:", error);
      toast({
        title: "Erro",
        description: "Falha ao processar os dados da frota. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Importar Frota</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={processFleetData} 
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isProcessing ? "Processando..." : "Importar Dados da Frota"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('https://raw.githubusercontent.com/navigcars/fleet/main/fleet.csv', '_blank')}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Visualizar Template
          </Button>
        </div>
        {isProcessing && (
          <Progress value={progress} className="w-full" />
        )}
        <p className="text-sm text-muted-foreground">
          Visualize o template para verificar o formato dos dados da frota.
          Clique em "Importar Dados da Frota" para processar e importar os dados.
        </p>
      </CardContent>
    </Card>
  );
};