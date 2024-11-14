import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Filter } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

const Reports = () => {
  const reports = [
    {
      title: "Relatório de Reservas",
      description: "Resumo detalhado de todas as reservas do período",
      date: "Última atualização: 10 minutos atrás",
      type: "PDF",
    },
    {
      title: "Análise de Frota",
      description: "Status e utilização dos veículos",
      date: "Última atualização: 1 hora atrás",
      type: "XLSX",
    },
    {
      title: "Relatório Financeiro",
      description: "Receitas, despesas e projeções",
      date: "Última atualização: 2 horas atrás",
      type: "PDF",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Relatórios</h1>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
        </div>

        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-xl">{report.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download {report.type}
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{report.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;