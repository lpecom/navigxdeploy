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
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <StatsPanel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RentalsList />
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Vehicle Locations</h2>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map View</p>
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