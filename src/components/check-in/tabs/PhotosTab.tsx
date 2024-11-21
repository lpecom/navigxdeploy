import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import type { PhotoCategory, PhotosState } from "../types";

interface PhotosTabProps {
  categories: PhotoCategory[];
  photos: PhotosState;
  onPhotoCapture: (category: string) => void;
  supabaseStorageUrl: string;
}

export const PhotosTab = ({ categories, photos, onPhotoCapture, supabaseStorageUrl }: PhotosTabProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {categories.map((category) => (
        <Card key={category.id} className="p-4">
          <div className="space-y-4">
            <h3 className="font-medium">{category.label}</h3>
            <div className="grid grid-cols-2 gap-2">
              {photos[category.id]?.map((photo, index) => (
                <img
                  key={index}
                  src={`${supabaseStorageUrl}${photo}`}
                  alt={`${category.label} ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
            <Button
              onClick={() => onPhotoCapture(category.id)}
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
  );
};