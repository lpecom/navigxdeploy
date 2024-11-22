import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CheckInTabs } from "./components/CheckInTabs";
import { ReservationHeader } from "./components/ReservationHeader";
import { LoadingState } from "./components/LoadingState";
import type { CheckInReservation, PhotoCategories } from "./types";

interface CheckInProcessProps {
  id: string;
}

export const CheckInProcess = ({ id }: CheckInProcessProps) => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<Record<PhotoCategories, string[]>>({
    exterior: [],
    interior: [],
    documents: [],
  });

  const { data: reservation, isLoading } = useQuery({
    queryKey: ["check-in", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("checkout_sessions")
        .select(`
          *,
          driver:driver_details (
            full_name,
            email,
            phone
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as CheckInReservation;
    },
  });

  const handlePhotoCapture = async (
    file: File,
    category: PhotoCategories
  ): Promise<void> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `check-in-photos/${id}/${category}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("vehicle-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Update the photos state
      const newPhotos = {
        ...photos,
        [category]: [...(photos[category] || []), data.path],
      };
      setPhotos(newPhotos);

      // Update the checkout session with the new photos
      const { error: updateError } = await supabase
        .from("checkout_sessions")
        .update({
          check_in_photos: newPhotos,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      toast({
        title: "Sucesso",
        description: "Foto adicionada com sucesso",
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da foto",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !reservation) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <ReservationHeader reservation={reservation} />
      <CheckInTabs
        reservation={reservation}
        photos={photos}
        onPhotoCapture={handlePhotoCapture}
      />
    </div>
  );
};