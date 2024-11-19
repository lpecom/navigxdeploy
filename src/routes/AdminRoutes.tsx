import { Routes, Route, Navigate } from "react-router-dom";
import Analytics from "@/pages/Analytics";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";
import Dashboard from "@/pages/Dashboard";
import Vehicles from "@/pages/Vehicles";
import VehicleDetails from "@/pages/VehicleDetails";
import Reservations from "@/pages/Reservations";
import Calendar from "@/pages/Calendar";
import Offers from "@/pages/Offers";
import Accessories from "@/pages/Accessories";
import Reports from "@/pages/Reports";
import Performance from "@/pages/Performance";
import Automations from "@/pages/Automations";
import Sidebar from "@/components/dashboard/Sidebar";

const AdminRoutes = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:pl-64">
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomerDetails />} />
              <Route path="/vehicles" element={<Navigate to="/admin/vehicles/overview" replace />} />
              <Route path="/vehicles/:view" element={<Vehicles view="overview" />} />
              <Route path="/vehicles/details/:id" element={<VehicleDetails />} />
              <Route path="/reservations/:filter" element={<Reservations filter="pending" />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminRoutes;