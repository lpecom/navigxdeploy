interface VehicleStatsProps {
  stats: {
    available: number;
    rented: number;
    maintenance: number;
    bodyShop: number;
    accident: number;
    deactivated: number;
    management: number;
    forSale: number;
  };
}

export const VehicleStats = ({ stats }: VehicleStatsProps) => {
  return (
    <div className="space-y-2 pt-2 border-t text-sm">
      {stats.available > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Disponíveis</span>
          <span className="font-medium text-green-600">{stats.available}</span>
        </div>
      )}
      {stats.rented > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Alugados</span>
          <span className="font-medium text-orange-600">{stats.rented}</span>
        </div>
      )}
      {stats.maintenance > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Em Manutenção</span>
          <span className="font-medium text-yellow-600">{stats.maintenance}</span>
        </div>
      )}
      {stats.bodyShop > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Funilaria</span>
          <span className="font-medium text-purple-600">{stats.bodyShop}</span>
        </div>
      )}
      {stats.accident > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Acidente</span>
          <span className="font-medium text-red-600">{stats.accident}</span>
        </div>
      )}
      {stats.deactivated > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Desativados</span>
          <span className="font-medium text-gray-600">{stats.deactivated}</span>
        </div>
      )}
      {stats.management > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Diretoria</span>
          <span className="font-medium text-blue-600">{stats.management}</span>
        </div>
      )}
      {stats.forSale > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">À Venda</span>
          <span className="font-medium text-blue-600">{stats.forSale}</span>
        </div>
      )}
    </div>
  );
};