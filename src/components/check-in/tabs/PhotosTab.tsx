import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
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
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">{category.label}</h3>
              <div className="grid grid-cols-2 gap-2">
                {photos[category.id]?.map((photo, index) => (
                  <motion.img
                    key={index}
                    src={`${supabaseStorageUrl}${photo}`}
                    alt={`${category.label} ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
              <Button
                onClick={() => onPhotoCapture(category.id)}
                className="w-full group hover:bg-primary/90 transition-colors"
                variant="outline"
              >
                <Camera className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Capturar Foto
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};