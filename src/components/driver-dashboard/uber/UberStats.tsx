import { Card, CardContent } from "@/components/ui/card";
import { Car, DollarSign, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UberStatsProps {
  stats: {
    earnings: number;
    trips: number;
    lastTripDate: string | null;
  } | null;
  isLoadingStats: boolean;
}

export const UberStats = ({ stats, isLoadingStats }: UberStatsProps) => {
  if (isLoadingStats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Ganhos Totais</p>
              <p className="text-lg font-semibold">
                R$ {stats.earnings.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total de Viagens</p>
              <p className="text-lg font-semibold">{stats.trips}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Última Viagem</p>
              <p className="text-lg font-semibold">
                {stats.lastTripDate ? 
                  new Date(stats.lastTripDate).toLocaleDateString('pt-BR') :
                  'Nenhuma viagem'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};