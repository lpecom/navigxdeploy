import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { CartProvider } from '@/contexts/CartContext';
import { useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Home from "./pages/Home";
import Plans from "./pages/Plans";
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

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Sessão encerrada",
          description: "Por favor, faça login novamente.",
        });
        // Clear any stored auth data
        await supabase.auth.signOut();
        window.location.href = '/login';
      }
    });

    // Check session validity on mount
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.log('Session check failed:', error);
        await supabase.auth.signOut();
        window.location.href = '/login';
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <TooltipProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/plans" element={<Plans />} />
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
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;