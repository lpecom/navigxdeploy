import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Car, Link as LinkIcon, DollarSign, Clock } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getUberToken, fetchUberEarnings, fetchUberTrips } from "./uber/uberApiUtils";
import { Skeleton } from "@/components/ui/skeleton";

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
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Conecte sua conta Uber para sincronizar seus ganhos e otimizar sua gestão financeira.
              </p>
              <Button
                onClick={handleUberConnect}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                {isLoading ? "Conectando..." : "Conectar conta Uber"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="flex items-center gap-2 text-green-600 mb-4">
                  <LinkIcon className="w-4 h-4" />
                  Conta Uber conectada
                </p>
              </div>
              
              {isLoadingStats ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
              ) : stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Ganhos Totais</p>
                          <p className="text-lg font-semibold">
                            R$ {stats.earnings.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Total de Viagens</p>
                          <p className="text-lg font-semibold">{stats.trips}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-500">Última Viagem</p>
                          <p className="text-lg font-semibold">
                            {stats.lastTripDate ? 
                              new Date(stats.lastTripDate).toLocaleDateString('pt-BR') :
                              'Nenhuma viagem'
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};