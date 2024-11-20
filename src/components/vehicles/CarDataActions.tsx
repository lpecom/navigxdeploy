import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

export const CarDataActions = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const exportCars = async () => {
    try {
      const { data: cars, error } = await supabase
        .from('car_models')
        .select(`
          id,
          name,
          description,
          year,
          image_url,
          brand_logo_url,
          engine_size,
          transmission,
          optionals,
          category:categories(name)
        `);

      if (error) throw error;

      const csvData = cars.map(car => ({
        name: car.name,
        description: car.description || '',
        year: car.year || '',
        image_url: car.image_url || '',
        brand_logo_url: car.brand_logo_url || '',
        engine_size: car.engine_size || '',
        transmission: car.transmission || '',
        category: car.category?.name || '',
        optionals: JSON.stringify(car.optionals || {})
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `cars_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Exportação concluída",
        description: `${cars.length} carros exportados com sucesso.`,
      });
    } catch (error: any) {
      console.error("Error exporting cars:", error);
      toast({
        title: "Erro na exportação",
        description: error.message || "Falha ao exportar dados dos carros.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo CSV",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const text = await file.text();
      const { data } = Papa.parse(text, { header: true });
      
      setUploadProgress(30);

      const { data: categories } = await supabase
        .from('categories')
        .select('id, name');

      const categoryMap = new Map(
        categories?.map(cat => [cat.name.toLowerCase(), cat.id]) || []
      );

      setUploadProgress(50);

      let processed = 0;
      const total = data.length;

      for (const row of data as any[]) {
        const categoryId = categoryMap.get(row.category?.toLowerCase());

        await supabase
          .from('car_models')
          .upsert({
            name: row.name,
            description: row.description,
            year: row.year,
            image_url: row.image_url,
            brand_logo_url: row.brand_logo_url,
            engine_size: row.engine_size,
            transmission: row.transmission,
            category_id: categoryId,
            optionals: row.optionals ? JSON.parse(row.optionals) : {},
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'name',
            ignoreDuplicates: false
          });

        processed++;
        setUploadProgress(50 + (processed / total) * 50);
      }

      toast({
        title: "Importação concluída",
        description: `${processed} carros atualizados com sucesso.`,
      });

      window.location.reload();
    } catch (error: any) {
      console.error("Error importing cars:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao importar dados dos carros.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      event.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="car-file-upload"
      />
      <Button
        onClick={exportCars}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Exportar Carros
      </Button>
      <div className="relative">
        <Button 
          onClick={() => document.getElementById('car-file-upload')?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Importando...' : 'Importar Carros'}
        </Button>
        {isUploading && (
          <Progress value={uploadProgress} className="w-full mt-2" />
        )}
      </div>
    </div>
  );
};