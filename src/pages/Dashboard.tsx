import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, CheckSquare, Bell, Users, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { projects, tasks, notifications, members, activities } = useApp();
  const navigate = useNavigate();

  const activeProjects = projects.filter(p => p.status === 'active');
  const myTasks = currentUser ? tasks.filter(t => t.assignedTo === currentUser.id) : [];
  const activeTasks = myTasks.filter(t => t.status !== 'done');
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const upcomingTasks = myTasks
    .filter(t => t.status !== 'done' && new Date(t.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const recentActivities = activities.slice(0, 5);

  const stats = [
    {
      title: t('dashboard.totalProjects'),
      value: activeProjects.length,
      icon: FolderKanban,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: t('dashboard.activeTasks'),
      value: activeTasks.length,
      icon: CheckSquare,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: t('dashboard.pendingNotifications'),
      value: unreadNotifications.length,
      icon: Bell,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: t('dashboard.teamMembers'),
      value: members.length,
      icon: Users,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'todo': 'status-planning',
      'in-progress': 'status-active',
      'in-review': 'status-on-hold',
      'done': 'status-completed',
    };
    return colors[status] || 'bg-muted';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high',
      'critical': 'priority-critical',
    };
    return colors[priority] || 'bg-muted';
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('common.welcome')}, {currentUser?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="gradient-card border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Tasks */}
        <Card className="gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              {t('dashboard.myTasks')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('common.noData')}
              </p>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate('/tasks')}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-accent/50 transition-base cursor-pointer"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium line-clamp-1">{task.title}</p>
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                    {task.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              {t('dashboard.recentActivity')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('common.noData')}
              </p>
            ) : (
              recentActivities.map((activity) => {
                const member = members.find(m => m.id === activity.userId);
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {member?.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{member?.name}</span>
                        {' '}{activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <Card className="gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8 col-span-full">
                {t('common.noData')}
              </p>
            ) : (
              activeProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate('/projects')}
                  className="p-4 rounded-lg bg-background/50 hover:bg-accent/50 transition-base cursor-pointer space-y-3"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium line-clamp-1">{project.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
