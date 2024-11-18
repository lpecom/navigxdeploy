import { CustomerList } from "@/components/customers/CustomerList";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Customers = () => {
  const { toast } = useToast();

  const handleImport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "process-customers-csv",
        {
          body: { 
            htmlUrl: 'https://brown-georgeanne-53.tiiny.site/',
            importDate: new Date().toISOString()
          },
        }
      );

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Lista de clientes importada com sucesso.",
      });

      // Force a page refresh to show the new data
      window.location.reload();
    } catch (error) {
      console.error("Error importing customers:", error);
      toast({
        title: "Erro",
        description: "Falha ao importar clientes. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <Button 
          onClick={handleImport}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Importar Clientes
        </Button>
      </div>
      <CustomerList />
    </div>
  );
};

export default Customers;