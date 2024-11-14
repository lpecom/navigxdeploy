import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ActiveRentals = () => {
  const { toast } = useToast();

  const activeRentals = [
    {
      id: 1,
      customer: "João Silva",
      vehicle: "Toyota Corolla 2023",
      location: "São Paulo - SP",
      startDate: "2024-02-20",
      endDate: "2024-02-25",
      status: "Em Andamento"
    }
  ];

  const handleFinishRental = (id: number) => {
    toast({
      title: "Aluguel Finalizado",
      description: "O veículo foi devolvido com sucesso."
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aluguéis Ativos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeRentals.map(rental => (
            <div key={rental.id} className="flex items-center justify-between p-4 border rounded-lg animate-fade-in">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Car className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{rental.customer}</h3>
                  <p className="text-sm text-gray-500">{rental.vehicle}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    {rental.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge>{rental.status}</Badge>
                <Button variant="outline" onClick={() => handleFinishRental(rental.id)}>
                  Finalizar Aluguel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveRentals;