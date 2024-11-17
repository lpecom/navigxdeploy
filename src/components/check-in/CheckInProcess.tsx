import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Image, CheckCircle, FileText, Printer } from "lucide-react";
import { toast } from "sonner";

const PHOTO_CATEGORIES = [
  { id: 'front', label: 'Frente' },
  { id: 'back', label: 'Traseira' },
  { id: 'left', label: 'Lateral Esquerda' },
  { id: 'right', label: 'Lateral Direita' },
  { id: 'interior', label: 'Interior' },
  { id: 'trunk', label: 'Porta-malas' },
  { id: 'damages', label: 'Danos (se houver)' },
];

const CheckInProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('photos');
  const [photos, setPhotos] = useState<Record<string, string[]>>({});
  
  const { data: reservation, isLoading } = useQuery({
    queryKey: ['check-in-reservation', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const handlePhotoCapture = async (category: string) => {
    try {
      // Create a file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      // Handle file selection
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const filePath = `${id}/${category}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('check-in-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Update state with new photo
        setPhotos(prev => ({
          ...prev,
          [category]: [...(prev[category] || []), data.path],
        }));

        toast.success('Foto adicionada com sucesso');
      };

      input.click();
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast.error('Erro ao capturar foto');
    }
  };

  const handleGenerateReport = async () => {
    // Implementation for generating report
    toast.success('Relatório gerado com sucesso');
  };

  if (isLoading || !reservation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Check-in do Veículo</h1>
        <Button variant="outline" onClick={() => navigate('/admin/check-in')}>
          Voltar
        </Button>
      </div>

      <Card className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium">{reservation.selected_car.name}</h3>
          <p className="text-sm text-muted-foreground">
            Cliente: {reservation.driver.full_name}
          </p>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Fotos
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Revisão
          </TabsTrigger>
          <TabsTrigger value="contract" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Contrato
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {PHOTO_CATEGORIES.map((category) => (
              <Card key={category.id} className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">{category.label}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {photos[category.id]?.map((photo, index) => (
                      <img
                        key={index}
                        src={`${supabase.storage.from('check-in-photos').getPublicUrl(photo).data.publicUrl}`}
                        alt={`${category.label} ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  <Button
                    onClick={() => handlePhotoCapture(category.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capturar Foto
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <div className="grid gap-4">
            {PHOTO_CATEGORIES.map((category) => (
              <Card key={category.id} className="p-4">
                <h3 className="font-medium mb-2">{category.label}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {photos[category.id]?.map((photo, index) => (
                    <img
                      key={index}
                      src={`${supabase.storage.from('check-in-photos').getPublicUrl(photo).data.publicUrl}`}
                      alt={`${category.label} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contract" className="space-y-4">
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
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button 
          className="w-full"
          onClick={() => {
            // Implementation for completing check-in
            toast.success('Check-in concluído com sucesso');
            navigate('/admin/check-in');
          }}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Concluir Check-in
        </Button>
      </div>
    </div>
  );
};

export default CheckInProcess;