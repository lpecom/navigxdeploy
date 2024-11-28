import { supabase } from "@/integrations/supabase/client";

interface UberCredentials {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export const getUberToken = async (driverId: string): Promise<string | null> => {
  const { data: integration } = await supabase
    .from('driver_uber_integrations')
    .select('*')
    .eq('driver_id', driverId)
    .maybeSingle();

  if (!integration) return null;

  // Check if token is expired
  const tokenExpiry = new Date(integration.token_expires_at);
  if (tokenExpiry <= new Date()) {
    // Token is expired, refresh it
    return refreshUberToken(driverId, integration.refresh_token);
  }

  return integration.access_token;
};

const refreshUberToken = async (driverId: string, refreshToken: string): Promise<string | null> => {
  try {
    const { error } = await supabase.functions.invoke('uber-auth', {
      body: { 
        driver_id: driverId,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }
    });

    if (error) throw error;

    // Fetch the new token from the database
    const { data: integration } = await supabase
      .from('driver_uber_integrations')
      .select('access_token')
      .eq('driver_id', driverId)
      .maybeSingle();

    return integration?.access_token || null;
  } catch (error) {
    console.error('Error refreshing Uber token:', error);
    return null;
  }
};

export const fetchUberEarnings = async (accessToken: string) => {
  const response = await fetch('https://api.uber.com/v1/partners/payments', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'pt-BR',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Uber earnings');
  }

  return response.json();
};

export const fetchUberTrips = async (accessToken: string) => {
  const response = await fetch('https://api.uber.com/v1/partners/trips', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'pt-BR',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Uber trips');
  }

  return response.json();
};