import { Info } from "lucide-react";
import { motion } from "framer-motion";

export const AnnouncementBar = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-primary text-white"
    >
      <div className="container mx-auto py-1.5 sm:py-2 px-4">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
          <Info className="w-3 h-3 sm:w-4 sm:h-4" />
          <p className="line-clamp-1">Aproveite nossas condições especiais para motoristas de aplicativo</p>
        </div>
      </div>
    </motion.div>
  );
};