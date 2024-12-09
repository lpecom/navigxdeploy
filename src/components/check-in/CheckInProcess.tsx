import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { CustomerReview } from "./steps/CustomerReview";
import { OrderReview } from "./steps/OrderReview";
import { VehicleAssignment } from "./steps/VehicleAssignment";
import { LoadingState } from "./components/LoadingState";
import { ReservationHeader } from "./components/ReservationHeader";
import { CheckInTabs } from "./components/CheckInTabs";
import type { PhotoCategory, CheckInReservation, PhotosState } from "./types";

const PHOTO_CATEGORIES: PhotoCategory[] = [
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
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('photos');
  const [photos, setPhotos] = useState<PhotosState>({});
  
  const { data: reservation, isLoading, error } = useQuery({
    queryKey: ['check-in-reservation', id],
    queryFn: async () => {
      if (!id) throw new Error('No reservation ID provided');

      const { data, error } = await supabase
        .from('checkout_sessions')
        .select(`
          *,
          driver:driver_details(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Reservation not found');
      
      return data as CheckInReservation;
    },
  });

  const handlePhotoCapture = async (category: string) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop();
        const filePath = `${id}/${category}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('check-in-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

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

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !reservation) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro ao carregar reserva</p>
        <Button variant="outline" onClick={() => navigate('/admin/check-in')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CustomerReview
            driverId={reservation.driver?.id}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <OrderReview
            sessionId={reservation.id}
            onNext={() => setStep(3)}
          />
        );
      case 3:
        return (
          <VehicleAssignment
            sessionId={reservation.id}
            onComplete={() => setStep(4)}
          />
        );
      case 4:
        return (
          <CheckInTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            categories={PHOTO_CATEGORIES}
            photos={photos}
            onPhotoCapture={handlePhotoCapture}
            supabaseStorageUrl={supabase.storage.from('check-in-photos').getPublicUrl('').data.publicUrl}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Check-in do Veículo</h1>
        <Button variant="outline" onClick={() => navigate('/admin/check-in')}>
          Voltar
        </Button>
      </div>

      <ReservationHeader reservation={reservation} />

      {renderStep()}

      {step === 4 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
          <Button 
            className="w-full"
            onClick={() => {
              toast.success('Check-in concluído com sucesso');
              navigate('/admin/check-in');
            }}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Concluir Check-in
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckInProcess;