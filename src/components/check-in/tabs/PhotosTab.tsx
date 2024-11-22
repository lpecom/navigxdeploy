import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";
import type { PhotoCategories, PhotosState } from "../types";

interface PhotoCategory {
  id: PhotoCategories;
  label: string;
}

interface PhotosTabProps {
  categories: PhotoCategory[];
  photos: PhotosState;
  onPhotoCapture: (file: File, category: PhotoCategories) => Promise<void>;
}

export const PhotosTab = ({ categories, photos, onPhotoCapture }: PhotosTabProps) => {
  const handleFileSelect = async (category: PhotoCategories, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onPhotoCapture(file, category);
    }
  };

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
                    src={photo}
                    alt={`${category.label} ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                ))}
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(category.id, e)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  className="w-full group hover:bg-primary/90 transition-colors"
                  variant="outline"
                >
                  <Camera className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Capturar Foto
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};