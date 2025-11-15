import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { NotificationType, NotificationPriority } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCheck, Bell, MessageSquare, FolderKanban, Settings, Trash2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Notifications: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useApp();
  const { toast } = useToast();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  
  const filteredNotifications = filter === 'unread'
    ? userNotifications.filter(n => !n.isRead)
    : userNotifications;

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    toast({
      title: t('common.success'),
      description: 'Notification marked as read',
    });
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    toast({
      title: t('common.success'),
      description: 'All notifications marked as read',
    });
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    toast({
      title: t('common.success'),
      description: 'Notification deleted',
    });
  };

  const getNotificationIcon = (type: NotificationType) => {
    const icons: Record<NotificationType, React.ReactNode> = {
      'task': <CheckCheck className="h-5 w-5 text-primary" />,
      'comment': <MessageSquare className="h-5 w-5 text-success" />,
      'project': <FolderKanban className="h-5 w-5 text-warning" />,
      'system': <Settings className="h-5 w-5 text-muted-foreground" />,
    };
    return icons[type];
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    const colors: Record<NotificationPriority, string> = {
      'high': 'bg-destructive/10 text-destructive border-destructive/20',
      'normal': 'bg-primary/10 text-primary border-primary/20',
      'low': 'bg-muted text-muted-foreground border-border',
    };
    return colors[priority];
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('notifications.title')}</h1>
              <p className="text-muted-foreground">
                {unreadCount} {unreadCount === 1 ? 'unread notification' : 'unread notifications'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm" className="gap-2">
              <CheckCheck className="h-4 w-4" />
              {t('notifications.markAllRead')}
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(value: any) => setFilter(value)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">All ({userNotifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-6">
          {filteredNotifications.length === 0 ? (
            <Card className="gradient-card border-0 shadow-md">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t('notifications.noNotifications')}</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`gradient-card border-0 shadow-md hover:shadow-primary transition-smooth ${
                  !notification.isRead ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      notification.isRead ? 'bg-muted' : 'bg-primary/10'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{notification.title}</CardTitle>
                            {notification.priority === 'high' && (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                          <CardDescription>{notification.message}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title={t('notifications.markAsRead')}
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {t(`notifications.type${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}`)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-3 mt-6">
          {filteredNotifications.length === 0 ? (
            <Card className="gradient-card border-0 shadow-md">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCheck className="h-12 w-12 text-success mb-4" />
                <p className="text-muted-foreground">All caught up! No unread notifications.</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className="gradient-card border-0 shadow-md hover:shadow-primary transition-smooth border-l-4 border-l-primary"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{notification.title}</CardTitle>
                            {notification.priority === 'high' && (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                          <CardDescription>{notification.message}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleMarkAsRead(notification.id)}
                            title={t('notifications.markAsRead')}
                          >
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {t(`notifications.type${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}`)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
