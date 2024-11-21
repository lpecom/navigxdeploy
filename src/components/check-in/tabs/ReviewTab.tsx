import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { PhotoCategory, PhotosState } from "../types";

interface ReviewTabProps {
  categories: PhotoCategory[];
  photos: PhotosState;
  supabaseStorageUrl: string;
}

export const ReviewTab = ({ categories, photos, supabaseStorageUrl }: ReviewTabProps) => {
  return (
    <motion.div 
      className="grid gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {categories.map((category) => (
        <Card key={category.id} className="p-4">
          <h3 className="font-medium mb-2">{category.label}</h3>
          <div className="grid grid-cols-3 gap-2">
            {photos[category.id]?.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <img
                  src={`${supabaseStorageUrl}${photo}`}
                  alt={`${category.label} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => window.open(`${supabaseStorageUrl}${photo}`, '_blank')}
                />
              </motion.div>
            ))}
          </div>
        </Card>
      ))}
    </motion.div>
  );
};