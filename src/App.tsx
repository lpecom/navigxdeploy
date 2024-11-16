import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { CartProvider } from '@/contexts/CartContext';
import Home from "./pages/Home";
import Plans from "./pages/Plans";
import { CheckoutPage } from "./components/checkout/CheckoutPage";
import DriverDashboard from "./pages/DriverDashboard";
import AdminRoutes from "./routes/AdminRoutes";

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/driver/*" element={<DriverDashboard />} />
          
          {/* Admin Routes - All admin routes are now handled by AdminRoutes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Routes>
      </TooltipProvider>
    </CartProvider>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <AppContent />
        </SessionContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;