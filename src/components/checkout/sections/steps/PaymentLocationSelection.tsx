import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

interface PaymentLocationSelectionProps {
  onSelect: (location: 'online' | 'store') => void;
}

export const PaymentLocationSelection = ({ onSelect }: PaymentLocationSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Como você prefere pagar?</h2>
        <p className="text-muted-foreground mt-2">
          Escolha entre pagar online agora ou na loja
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div whileHover={{ scale: 1.02 }}>
          <Card
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelect('online')}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Pagar Online</h3>
                <p className="text-sm text-muted-foreground">
                  Pague agora e garanta sua reserva imediatamente
                </p>
              </div>
              <Button className="w-full">Pagar Online</Button>
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <Card
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={() => onSelect('store')}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Pagar na Loja</h3>
                <p className="text-sm text-muted-foreground">
                  Faça sua reserva e pague pessoalmente na retirada
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Pagar na Loja
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};