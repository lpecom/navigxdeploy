import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const brands = [
  { name: "Tesla", logo: "https://i.imgur.com/3uJ3v7N.png" },
  { name: "BMW", logo: "https://i.imgur.com/2RFcHk3.png" },
  { name: "Ferrari", logo: "https://i.imgur.com/YHXuvkF.png" },
  { name: "Mercedes", logo: "https://i.imgur.com/8e8KoZD.png" },
];

interface BrandFiltersProps {
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
}

export const BrandFilters = ({ selectedBrand, onSelectBrand }: BrandFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      {brands.map((brand) => (
        <motion.button
          key={brand.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectBrand(brand.name)}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-lg bg-white shadow-sm hover:shadow transition-all",
            selectedBrand === brand.name && "ring-2 ring-primary"
          )}
        >
          <img src={brand.logo} alt={brand.name} className="w-6 h-6 object-contain" />
          <span className="font-medium">{brand.name}</span>
        </motion.button>
      ))}
      <Button variant="ghost" onClick={() => onSelectBrand(null)}>
        ver todos
      </Button>
    </div>
  );
};