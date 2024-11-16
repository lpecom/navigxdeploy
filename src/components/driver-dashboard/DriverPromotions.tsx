import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Package, ArrowRight } from "lucide-react";

interface DriverPromotionsProps {
  driverId: string;
}

export const DriverPromotions = ({ driverId }: DriverPromotionsProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Promoções</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Destaque</Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Upgrade de Veículo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">BMW 320i</h3>
                <p className="text-sm text-muted-foreground">
                  Faça um upgrade para um veículo premium com condições especiais
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Valor do Upgrade</span>
                  <span className="font-medium">+ R$ 200,00/mês</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Economia</span>
                  <span className="font-medium text-green-600">R$ 150,00/mês</span>
                </div>
              </div>
              <Button className="w-full">
                Ver Detalhes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Pacote de Opcionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Pacote Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione mais conforto ao seu veículo com nosso pacote premium
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Valor do Pacote</span>
                  <span className="font-medium">R$ 150,00/mês</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Itens Inclusos</span>
                  <span className="font-medium">4 itens</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Ver Detalhes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outras Ofertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <h3 className="font-medium">Oferta {i}</h3>
                <p className="text-sm text-muted-foreground">
                  Descrição da oferta {i} com detalhes importantes
                </p>
                <Button variant="ghost" className="w-full">
                  Ver Mais
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};