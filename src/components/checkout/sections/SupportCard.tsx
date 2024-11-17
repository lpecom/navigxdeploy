import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const SupportCard = () => {
  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100 sticky top-4">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        Precisa de ajuda?
      </h3>
      <p className="text-sm text-gray-600">
        Nossa equipe está disponível para te ajudar pelo WhatsApp. Clique no botão abaixo para iniciar uma conversa.
      </p>
      <Button 
        variant="outline"
        className="w-full mt-4 bg-white hover:bg-gray-50"
        onClick={() => window.open('https://wa.me/seu-numero', '_blank')}
      >
        Falar com Suporte
      </Button>
    </Card>
  );
};