import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationButtonsProps {
  isSubmitting: boolean;
}

export const NavigationButtons = ({ isSubmitting }: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between pt-4">
      <Link to="/optionals">
        <Button variant="outline" className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
      </Link>
      <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
        {isSubmitting ? "Salvando..." : "Continuar"}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};