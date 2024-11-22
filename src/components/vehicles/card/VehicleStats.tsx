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
  const statusConfig = [
    { key: 'available', label: 'Disponíveis', colorClass: 'text-green-600' },
    { key: 'rented', label: 'Alugados', colorClass: 'text-orange-600' },
    { key: 'maintenance', label: 'Em Manutenção', colorClass: 'text-yellow-600' },
    { key: 'bodyShop', label: 'Funilaria', colorClass: 'text-purple-600' },
    { key: 'accident', label: 'Acidente', colorClass: 'text-red-600' },
    { key: 'deactivated', label: 'Desativados', colorClass: 'text-gray-600' },
    { key: 'management', label: 'Diretoria', colorClass: 'text-blue-600' },
    { key: 'forSale', label: 'À Venda', colorClass: 'text-blue-600' },
  ] as const;

  return (
    <div className="space-y-2 pt-2 border-t text-sm">
      {statusConfig.map(({ key, label, colorClass }) => (
        <div key={key} className="flex justify-between items-center">
          <span className="text-muted-foreground">{label}</span>
          <span className={`font-medium ${colorClass}`}>
            {stats[key]}
          </span>
        </div>
      ))}
    </div>
  );
};