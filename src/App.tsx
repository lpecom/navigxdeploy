import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { CartProvider } from '@/contexts/CartContext';
import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Home from "./pages/Home";
import { CheckoutPage } from "./components/checkout/CheckoutPage";
import DriverDashboard from "./pages/DriverDashboard";
import AdminRoutes from "./routes/AdminRoutes";
import AdminLogin from "./pages/AdminLogin";
import DriverLogin from "./pages/DriverLogin";

// Move queryClient outside component to avoid recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRouteHandler = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Sessão encerrada",
          description: "Por favor, faça login novamente.",
        });
        navigate('/login');
      }

      if (!session) {
        toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente.",
          variant: "destructive",
        });
        
        await supabase.auth.signOut();
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, navigate]);

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<DriverLogin />} />
            
            {/* Protected Routes */}
            <Route path="/driver/*" element={
              <ProtectedRouteHandler>
                <DriverDashboard />
              </ProtectedRouteHandler>
            } />
            
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <ProtectedRouteHandler>
                <AdminRoutes />
              </ProtectedRouteHandler>
            } />
            
            {/* Legacy route redirect */}
            <Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />
            
            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <AppContent />
        <Toaster />
        <Sonner />
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;