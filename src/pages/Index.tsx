import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsPanel from "@/components/dashboard/StatsPanel";
import RentalsList from "@/components/dashboard/RentalsList";

const Index = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-medium text-gray-900">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Monitor and manage your rental operations
                </p>
              </div>
            </div>

            <StatsPanel />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-muted shadow-sm">
                <h2 className="text-base font-medium flex items-center gap-2 mb-4">Active Rentals</h2>
                <RentalsList />
              </div>
              <div className="bg-white p-6 rounded-lg border border-muted shadow-sm">
                <h2 className="text-base font-medium mb-4">Vehicle Locations</h2>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Map View</p>
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