import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ThermometerSnowflake, ThermometerSun, User, FileText, Shield } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReservationDetailsProps {
  reservationId: string;
}

const ReservationDetails = ({ reservationId }: ReservationDetailsProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Detalhes da Reserva</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Informações do Cliente</h3>
            <div className="space-y-1">
              <p className="text-sm">John Doe</p>
              <p className="text-sm text-muted-foreground">CPF: 123.456.789-00</p>
              <p className="text-sm text-muted-foreground">john@example.com</p>
              <p className="text-sm text-muted-foreground">(11) 98765-4321</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Avaliação de Risco</h3>
            <div className="space-y-2">
              <Badge className="bg-success text-white flex gap-1 items-center w-fit">
                <ThermometerSnowflake className="w-4 h-4" />
                Baixo Risco
              </Badge>
              <Progress value={25} className="h-2" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Documentos</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-sm">CNH Verificada</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-success" />
                <span className="text-sm">Documentos Completos</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationDetails;