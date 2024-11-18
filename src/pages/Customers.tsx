import { CustomerList } from "@/components/customers/CustomerList";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Customers = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke(
        "process-customers-csv",
        {
          body: formData,
        }
      );

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${data.processed} clientes importados com sucesso.${
          data.errors?.length ? ` ${data.errors.length} erros encontrados.` : ''
        }`,
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
        <div className="relative">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="customer-file-upload"
          />
          <Button 
            onClick={() => document.getElementById('customer-file-upload')?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Importando...' : 'Importar Clientes'}
          </Button>
        </div>
      </div>
      <CustomerList />
    </div>
  );
};

export default Customers;