import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Wallet as WalletType } from "@/types/database";

interface WalletCardProps {
  driverId: string;
}

export const WalletCard = ({ driverId }: WalletCardProps) => {
  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet', driverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallet')
        .select('*')
        .eq('driver_id', driverId)
        .maybeSingle();

      if (error) throw error;

      // If no wallet exists, create one
      if (!data) {
        const { data: newWallet, error: createError } = await supabase
          .from('wallet')
          .insert({
            driver_id: driverId,
            balance: 0,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        return newWallet as WalletType;
      }

      return data as WalletType;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          R$ {wallet?.balance.toFixed(2) || '0,00'}
        </div>
      </CardContent>
    </Card>
  );
};