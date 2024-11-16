import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Car, Link as LinkIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

interface UberIntegrationProps {
  driverId: string;
}

export const UberIntegration = ({ driverId }: UberIntegrationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Check if we have a code parameter in the URL (OAuth callback)
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (code) {
      handleUberCallback(code);
    }

    // Check existing integration
    checkIntegrationStatus();
  }, [driverId]);

  const checkIntegrationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('driver_uber_integrations')
        .select('is_active')
        .eq('driver_id', driverId)
        .single();

      if (error) throw error;
      setIsConnected(data?.is_active || false);
    } catch (error) {
      console.error('Error checking integration status:', error);
    }
  };

  const handleUberConnect = () => {
    const clientId = import.meta.env.VITE_UBER_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_UBER_REDIRECT_URI;
    const scope = 'partner.accounts';
    
    const authUrl = `https://auth.uber.com/oauth/v2/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}`;
    
    // Store driver_id in localStorage for retrieval after redirect
    localStorage.setItem('uber_integration_driver_id', driverId);
    
    // Redirect to Uber auth
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
      
      // Clean up URL
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
            <div className="text-sm text-gray-600">
              <p className="flex items-center gap-2 text-green-600">
                <LinkIcon className="w-4 h-4" />
                Conta Uber conectada
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};