import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
          title: "Error",
          description: "Não foi possível carregar as notificações",
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
        return <Calendar className="h-5 w-5" />;
      case 'payment':
        return <Bell className="h-5 w-5" />;
      case 'system':
        return <MessageSquare className="h-5 w-5" />;
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Não foi possível atualizar a notificação",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-100 rounded-lg" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
        <Badge variant="secondary">
          {notifications.filter(n => !n.is_read).length} não lidas
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Central de Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma notificação encontrada
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start space-x-4 p-4 rounded-lg transition-colors cursor-pointer",
                  notification.is_read ? "bg-background" : "bg-primary/5"
                )}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className={cn(
                  "p-2 rounded-full",
                  notification.is_read ? "bg-muted" : "bg-primary/10"
                )}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{notification.title}</p>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};