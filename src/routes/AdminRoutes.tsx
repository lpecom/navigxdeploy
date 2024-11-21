import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Vehicles from "@/pages/Vehicles";
import VehicleDetails from "@/pages/VehicleDetails";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";
import Reservations from "@/pages/Reservations";
import Offers from "@/pages/Offers";
import Accessories from "@/pages/Accessories";
import Optionals from "@/pages/Optionals";
import Analytics from "@/pages/Analytics";
import Performance from "@/pages/Performance";
import Reports from "@/pages/Reports";
import Automations from "@/pages/Automations";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

const AdminRoutes = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="vehicles" element={<Vehicles view="fleet" />} />
              <Route path="vehicles/:id" element={<VehicleDetails />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetails />} />
              <Route path="reservations" element={<Reservations filter="all" />} />
              <Route path="offers" element={<Offers />} />
              <Route path="accessories" element={<Accessories />} />
              <Route path="optionals" element={<Optionals />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="performance" element={<Performance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="automations" element={<Automations />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminRoutes;