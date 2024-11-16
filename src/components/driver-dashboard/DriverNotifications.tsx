import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'maintenance' | 'payment' | 'system';
  isRead: boolean;
  createdAt: string;
}

export const DriverNotifications = () => {
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Próxima Revisão',
      message: 'Sua próxima revisão está agendada para 15/04/2024.',
      type: 'maintenance',
      isRead: false,
      createdAt: '2024-03-20T10:00:00Z'
    },
    {
      id: '2',
      title: 'Pagamento Confirmado',
      message: 'Seu último pagamento foi processado com sucesso.',
      type: 'payment',
      isRead: true,
      createdAt: '2024-03-19T15:30:00Z'
    },
    {
      id: '3',
      title: 'Atualização do Sistema',
      message: 'Novos recursos foram adicionados ao seu painel.',
      type: 'system',
      isRead: false,
      createdAt: '2024-03-18T09:15:00Z'
    }
  ]);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
        <Badge variant="secondary">
          {notifications.filter(n => !n.isRead).length} não lidas
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Central de Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-start space-x-4 p-4 rounded-lg transition-colors",
                notification.isRead ? "bg-background" : "bg-primary/5"
              )}
            >
              <div className={cn(
                "p-2 rounded-full",
                notification.isRead ? "bg-muted" : "bg-primary/10"
              )}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{notification.title}</p>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};