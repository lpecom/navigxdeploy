import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Calendar, Clock, User, Car, ArrowRightToLine, Package } from "lucide-react";
import { ReservationExpandedContent } from "./ReservationExpandedContent";
import { StatusBadges } from "./StatusBadges";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Reservation } from "@/types/reservation";
import { ReservationActions } from "./ReservationActions";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

interface ReservationCardProps {
  reservation: Reservation;
  isExpanded: boolean;
  onToggle: () => void;
}

const ReservationCardComponent = ({ reservation, isExpanded, onToggle }: ReservationCardProps) => {
  const navigate = useNavigate();
  const pickupDate = new Date(reservation.pickupDate);
  const formattedDate = format(pickupDate, "dd 'de' MMMM", { locale: ptBR });
  const creationDate = format(new Date(reservation.createdAt), "dd/MM/yyyy HH:mm");

  const handleCheckIn = () => {
    navigate(`/admin/check-in/${reservation.id}`);
  };

  const showCheckInButton = reservation.status === 'approved';

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Risk Analysis Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{reservation.customerName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Criado em: {creationDate}</span>
                  </div>
                </div>
              </div>
              
              <StatusBadges reservation={reservation} />
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggle}
              className="shrink-0"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Car className="w-4 h-4" />
                <span>Veículo</span>
              </div>
              <p className="font-medium">{reservation.carCategory}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Data de Retirada</span>
              </div>
              <p className="font-medium">{formattedDate}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Horário</span>
              </div>
              <p className="font-medium">{reservation.pickupTime || "Não definido"}</p>
            </div>
          </div>

          {/* Optionals Section */}
          {reservation.optionals && reservation.optionals.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Opcionais Selecionados
              </h4>
              <div className="flex flex-wrap gap-2">
                {reservation.optionals.map((optional, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {optional.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!isExpanded && (
            <div className="flex justify-between items-center pt-4 border-t">
              {showCheckInButton && (
                <Button 
                  onClick={handleCheckIn}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <ArrowRightToLine className="w-4 h-4" />
                  Iniciar Check-in
                </Button>
              )}

              <ReservationActions 
                reservation={reservation}
                currentStatus={reservation.status}
                hideCheckIn={true}
              />
            </div>
          )}
        </div>

        {isExpanded && (
          <ReservationExpandedContent 
            reservation={reservation}
            onApprove={() => {}}
            onReject={() => {}}
          />
        )}
      </CardContent>
    </Card>
  );
};

export const ReservationCard = memo(ReservationCardComponent);