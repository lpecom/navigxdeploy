import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsPanel from "@/components/dashboard/StatsPanel";
import RentalsList from "@/components/dashboard/RentalsList";

const Index = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Painel de Controle</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitore e gerencie suas operações de aluguel
              </p>
            </div>

            <StatsPanel />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-medium flex items-center gap-2 mb-4">Aluguéis Ativos</h2>
                <RentalsList />
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-medium mb-4">Localização dos Veículos</h2>
                <div className="aspect-video bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Visualização do Mapa</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;