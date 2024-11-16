import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'maintenance' | 'payment' | 'system';
  is_read: boolean;
  created_at: string;
}

export const DriverNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) return;

        // First get the driver_id
        const { data: driverData } = await supabase
          .from('driver_details')
          .select('id')
          .eq('email', session.session.user.email)
          .single();

        if (!driverData) return;

        // Then fetch notifications for this driver
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('driver_id', driverData.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Validate and transform the notification type
        const validatedNotifications = (data || []).map(notification => ({
          ...notification,
          type: validateNotificationType(notification.type)
        }));

        setNotifications(validatedNotifications);
      } catch (error) {
        toast({
          title: "Erro ao carregar notificações",
          description: "Não foi possível carregar suas notificações. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [toast]);

  const validateNotificationType = (type: string): 'maintenance' | 'payment' | 'system' => {
    switch (type) {
      case 'maintenance':
      case 'payment':
      case 'system':
        return type;
      default:
        return 'system';
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'maintenance':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <Bell className="h-5 w-5 text-green-500" />;
      case 'system':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      toast({
        title: "Notificação marcada como lida",
        description: "A notificação foi atualizada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a notificação",
        variant: "destructive",
      });
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-start space-x-4 p-4 rounded-lg border animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
          <p className="text-muted-foreground">
            Gerencie suas notificações e atualizações importantes
          </p>
        </div>
        {!isLoading && (
          <Badge variant="secondary" className="h-7">
            {notifications.filter(n => !n.is_read).length} não lidas
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Central de Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="font-medium">Nenhuma notificação encontrada</p>
              <p className="text-sm">Você será notificado quando houver atualizações importantes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start space-x-4 p-4 rounded-lg transition-colors cursor-pointer hover:bg-accent/50",
                    notification.is_read ? "bg-background" : "bg-primary/5"
                  )}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className={cn(
                    "p-2 rounded-full shrink-0",
                    notification.is_read ? "bg-muted" : "bg-primary/10"
                  )}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{notification.title}</p>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};