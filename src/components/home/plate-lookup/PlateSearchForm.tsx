import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface PlateSearchFormProps {
  plate: string;
  isLoading: boolean;
  onPlateChange: (value: string) => void;
  onSearch: () => void;
}

export const PlateSearchForm = ({ 
  plate, 
  isLoading, 
  onPlateChange, 
  onSearch 
}: PlateSearchFormProps) => {
  return (
    <div className="flex gap-2">
      <Input
        value={plate}
        onChange={(e) => onPlateChange(e.target.value.toUpperCase())}
        placeholder="ABC1234"
        className="bg-white/10 border-gray-700 text-white placeholder:text-gray-500"
        maxLength={7}
      />
      <Button 
        onClick={onSearch} 
        disabled={isLoading}
        className="bg-primary-500 hover:bg-primary-600 text-white"
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Search className="w-4 h-4" />
          </motion.div>
        ) : (
          <Search className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};