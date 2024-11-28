import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Car } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getUberToken, fetchUberEarnings, fetchUberTrips } from "./uber/uberApiUtils";
import { UberConnect } from "./uber/UberConnect";
import { UberConnected } from "./uber/UberConnected";

interface UberIntegrationProps {
  driverId: string;
}

interface UberStats {
  earnings: number;
  trips: number;
  lastTripDate: string | null;
}

export const UberIntegration = ({ driverId }: UberIntegrationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<UberStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (code) {
      handleUberCallback(code);
    }

    checkIntegrationStatus();
  }, [driverId]);

  useEffect(() => {
    if (isConnected) {
      fetchUberStats();
    }
  }, [isConnected]);

  const checkIntegrationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('driver_uber_integrations')
        .select('is_active')
        .eq('driver_id', driverId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setIsConnected(data?.is_active || false);
    } catch (error) {
      console.error('Error checking integration status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível verificar o status da integração.",
        variant: "destructive",
      });
    }
  };

  const fetchUberStats = async () => {
    setIsLoadingStats(true);
    try {
      const token = await getUberToken(driverId);
      if (!token) {
        setIsConnected(false);
        return;
      }

      const [earningsData, tripsData] = await Promise.all([
        fetchUberEarnings(token),
        fetchUberTrips(token)
      ]);

      setStats({
        earnings: earningsData.total_earnings || 0,
        trips: tripsData.count || 0,
        lastTripDate: tripsData.trips?.[0]?.completed_at || null
      });
    } catch (error) {
      console.error('Error fetching Uber stats:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do Uber.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleUberConnect = () => {
    const clientId = import.meta.env.VITE_UBER_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_UBER_REDIRECT_URI;
    const scope = 'partner.accounts partner.payments partner.trips';
    
    const authUrl = `https://auth.uber.com/oauth/v2/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}`;
    
    localStorage.setItem('uber_integration_driver_id', driverId);
    
    window.location.href = authUrl;
  };

  const handleUberCallback = async (code: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('uber-auth', {
        body: { code, driver_id: driverId }
      });

      if (error) throw error;

      toast({
        title: "Conta Uber conectada com sucesso!",
        description: "Sua conta Uber foi vinculada à sua conta Navig.",
      });
      
      setIsConnected(true);
      
      window.history.replaceState({}, '', location.pathname);
    } catch (error) {
      console.error('Error connecting Uber account:', error);
      toast({
        title: "Erro ao conectar conta Uber",
        description: "Ocorreu um erro ao vincular sua conta Uber. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          Integração com Uber
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isConnected ? (
            <UberConnect 
              onConnect={handleUberConnect}
              isLoading={isLoading}
            />
          ) : (
            <UberConnected 
              stats={stats}
              isLoadingStats={isLoadingStats}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};