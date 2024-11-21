import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import Vehicles from "@/pages/Vehicles";
import VehicleDetails from "@/pages/VehicleDetails";
import Offers from "@/pages/Offers";
import Accessories from "@/pages/Accessories";
import Analytics from "@/pages/Analytics";
import Performance from "@/pages/Performance";
import Reports from "@/pages/Reports";
import Automations from "@/pages/Automations";
import Reservations from "@/pages/Reservations";
import Dashboard from "@/pages/Dashboard";
import Customers from "@/pages/Customers";
import CustomerDetails from "@/pages/CustomerDetails";
import CheckInList from "@/components/check-in/CheckInList";
import CheckInProcess from "@/components/check-in/CheckInProcess";
import { WebsiteSettings } from "@/components/website-manager/WebsiteSettings";
import Changelog from "@/pages/Changelog";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

const AdminRoutes = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/admin/login");
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/admin/login");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="vehicles">
                <Route path="overview" element={<Vehicles view="overview" />} />
                <Route path="categories" element={<Vehicles view="categories" />} />
                <Route path="models" element={<Vehicles view="models" />} />
                <Route path="fleet" element={<Vehicles view="fleet" />} />
                <Route path="maintenance" element={<Vehicles view="maintenance" />} />
                <Route path=":id" element={<VehicleDetails />} />
              </Route>
              <Route path="customers">
                <Route index element={<Customers />} />
                <Route path=":id" element={<CustomerDetails />} />
              </Route>
              <Route path="check-in">
                <Route index element={<CheckInList />} />
                <Route path=":id" element={<CheckInProcess />} />
              </Route>
              <Route path="website-settings" element={<WebsiteSettings />} />
              <Route path="changelog" element={<Changelog />} />
              <Route path="offers" element={<Offers />} />
              <Route path="accessories" element={<Accessories />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="performance" element={<Performance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="automations" element={<Automations />} />
              <Route path="reservations">
                <Route path="pending" element={<Reservations filter="pending" />} />
                <Route path="pickup" element={<Reservations filter="pickup" />} />
              </Route>
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default AdminRoutes;