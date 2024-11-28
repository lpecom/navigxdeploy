import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";

interface UberConnectProps {
  onConnect: () => void;
  isLoading: boolean;
}

export const UberConnect = ({ onConnect, isLoading }: UberConnectProps) => {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Conecte sua conta Uber para sincronizar seus ganhos e otimizar sua gestão financeira.
      </p>
      <Button
        onClick={onConnect}
        disabled={isLoading}
        className="w-full sm:w-auto"
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        {isLoading ? "Conectando..." : "Conectar conta Uber"}
      </Button>
    </div>
  );
};