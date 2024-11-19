import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MaintenanceData {
  plate: string;
  date: string;
  model: string;
  customer: string | null;
}

interface MaintenanceListProps {
  data: MaintenanceData[];
}

export const MaintenanceList = ({ data }: MaintenanceListProps) => {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-gray-900">
          Próximas Manutenções
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium">Placa</TableHead>
              <TableHead className="text-xs font-medium">Data</TableHead>
              <TableHead className="text-xs font-medium">Modelo</TableHead>
              <TableHead className="text-xs font-medium">Cliente</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="text-sm font-medium">{item.plate}</TableCell>
                <TableCell className="text-sm text-gray-600">{item.date}</TableCell>
                <TableCell className="text-sm text-gray-600">{item.model}</TableCell>
                <TableCell className="text-sm text-gray-600">{item.customer || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};