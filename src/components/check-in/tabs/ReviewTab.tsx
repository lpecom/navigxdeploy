import { Card } from "@/components/ui/card";
import type { PhotoCategory, PhotosState } from "../types";

interface ReviewTabProps {
  categories: PhotoCategory[];
  photos: PhotosState;
  supabaseStorageUrl: string;
}

export const ReviewTab = ({ categories, photos, supabaseStorageUrl }: ReviewTabProps) => {
  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <Card key={category.id} className="p-4">
          <h3 className="font-medium mb-2">{category.label}</h3>
          <div className="grid grid-cols-3 gap-2">
            {photos[category.id]?.map((photo, index) => (
              <img
                key={index}
                src={`${supabaseStorageUrl}${photo}`}
                alt={`${category.label} ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};