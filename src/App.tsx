import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SessionContextProvider, AuthChangeEvent } from '@supabase/auth-helpers-react';
import { CartProvider } from '@/contexts/CartContext';
import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Home from "./pages/Home";
import { CheckoutPage } from "./components/checkout/CheckoutPage";
import DriverDashboard from "./pages/DriverDashboard";
import AdminRoutes from "./routes/AdminRoutes";
import AdminLogin from "./pages/AdminLogin";
import DriverLogin from "./pages/DriverLogin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Sessão encerrada",
          description: "Por favor, faça login novamente.",
        });
        navigate('/login');
      }

      // Handle session expiration
      if (!session && event !== 'SIGNED_OUT') {
        toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente.",
          variant: "destructive",
        });
        
        // Clear any existing session
        supabase.auth.signOut().then(() => {
          navigate('/login');
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, navigate]);

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<DriverLogin />} />
            
            {/* Driver Routes */}
            <Route path="/driver/*" element={<DriverDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            
            {/* Legacy route redirect */}
            <Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />
            
            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <CartProvider>
          <AppContent />
          <Toaster />
          <Sonner />
        </CartProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;