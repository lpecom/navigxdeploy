import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Image, FileText } from "lucide-react";
import { PhotosTab } from "../tabs/PhotosTab";
import { ReviewTab } from "../tabs/ReviewTab";
import { ContractTab } from "../tabs/ContractTab";
import type { PhotoCategory, PhotosState } from "../types";

interface CheckInTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  categories: PhotoCategory[];
  photos: PhotosState;
  onPhotoCapture: (category: string) => void;
  supabaseStorageUrl: string;
}

export const CheckInTabs = ({
  activeTab,
  setActiveTab,
  categories,
  photos,
  onPhotoCapture,
  supabaseStorageUrl,
}: CheckInTabsProps) => {
  return (
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

      <TabsContent value="photos">
        <PhotosTab 
          categories={categories}
          photos={photos}
          onPhotoCapture={onPhotoCapture}
          supabaseStorageUrl={supabaseStorageUrl}
        />
      </TabsContent>

      <TabsContent value="review">
        <ReviewTab 
          categories={categories}
          photos={photos}
          supabaseStorageUrl={supabaseStorageUrl}
        />
      </TabsContent>

      <TabsContent value="contract">
        <ContractTab />
      </TabsContent>
    </Tabs>
  );
};