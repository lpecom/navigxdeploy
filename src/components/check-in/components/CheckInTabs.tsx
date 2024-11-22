import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Image, FileText } from "lucide-react";
import { PhotosTab } from "../tabs/PhotosTab";
import { ReviewTab } from "../tabs/ReviewTab";
import { ContractTab } from "../tabs/ContractTab";
import type { PhotoCategories, PhotosState, CheckInReservation } from "../types";

interface CheckInTabsProps {
  reservation: CheckInReservation;
  photos: PhotosState;
  onPhotoCapture: (file: File, category: PhotoCategories) => Promise<void>;
}

const PHOTO_CATEGORIES = [
  { id: "exterior" as const, label: "Exterior" },
  { id: "interior" as const, label: "Interior" },
  { id: "documents" as const, label: "Documentos" },
];

export const CheckInTabs = ({
  reservation,
  photos,
  onPhotoCapture,
}: CheckInTabsProps) => {
  return (
    <Tabs defaultValue="photos" className="space-y-4">
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

      <TabsContent value="photos">
        <PhotosTab 
          categories={PHOTO_CATEGORIES}
          photos={photos}
          onPhotoCapture={onPhotoCapture}
        />
      </TabsContent>

      <TabsContent value="review">
        <ReviewTab 
          categories={PHOTO_CATEGORIES}
          photos={photos}
        />
      </TabsContent>

      <TabsContent value="contract">
        <ContractTab />
      </TabsContent>
    </Tabs>
  );
};