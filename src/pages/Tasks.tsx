import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Calendar, User, Pencil, Trash2, Filter } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Tasks: React.FC = () => {
  const { t } = useLanguage();
  const { tasks, projects, members, addTask, updateTask, deleteTask } = useApp();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    assignedTo: '',
    projectId: '',
    dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        projectId: task.projectId,
        dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd'),
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignedTo: '',
        projectId: '',
        dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: t('common.error'),
        description: 'Task title is required',
        variant: 'destructive',
      });
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        ...formData,
        dueDate: new Date(formData.dueDate),
      });
      toast({
        title: t('common.success'),
        description: 'Task updated successfully',
      });
    } else {
      const newTask: Task = {
        id: `t${Date.now()}`,
        ...formData,
        dueDate: new Date(formData.dueDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addTask(newTask);
      toast({
        title: t('common.success'),
        description: 'Task created successfully',
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteTaskId) {
      deleteTask(deleteTaskId);
      toast({
        title: t('common.success'),
        description: 'Task deleted successfully',
      });
      setDeleteTaskId(null);
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors: Record<TaskStatus, string> = {
      'todo': 'status-planning',
      'in-progress': 'status-active',
      'in-review': 'status-on-hold',
      'done': 'status-completed',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: TaskPriority) => {
    const colors: Record<TaskPriority, string> = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high',
      'critical': 'priority-critical',
    };
    return colors[priority];
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('tasks.title')}</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your tasks
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('tasks.addTask')}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? t('tasks.editTask') : t('tasks.addTask')}
                </DialogTitle>
                <DialogDescription>
                  Fill in the task details below
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t('tasks.taskTitle')} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('tasks.description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project">{t('tasks.project')}</Label>
                    <Select
                      value={formData.projectId}
                      onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedTo">{t('tasks.assignedTo')}</Label>
                    <Select
                      value={formData.assignedTo}
                      onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {members.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">{t('tasks.status')}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="todo">{t('tasks.statusTodo')}</SelectItem>
                        <SelectItem value="in-progress">{t('tasks.statusInProgress')}</SelectItem>
                        <SelectItem value="in-review">{t('tasks.statusInReview')}</SelectItem>
                        <SelectItem value="done">{t('tasks.statusDone')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">{t('tasks.priority')}</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="low">{t('tasks.priorityLow')}</SelectItem>
                        <SelectItem value="medium">{t('tasks.priorityMedium')}</SelectItem>
                        <SelectItem value="high">{t('tasks.priorityHigh')}</SelectItem>
                        <SelectItem value="critical">{t('tasks.priorityCritical')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">{t('tasks.dueDate')}</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">{t('common.save')}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-36 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">{t('tasks.statusTodo')}</SelectItem>
              <SelectItem value="in-progress">{t('tasks.statusInProgress')}</SelectItem>
              <SelectItem value="in-review">{t('tasks.statusInReview')}</SelectItem>
              <SelectItem value="done">{t('tasks.statusDone')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={(value: any) => setPriorityFilter(value)}>
            <SelectTrigger className="w-36 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">{t('tasks.priorityLow')}</SelectItem>
              <SelectItem value="medium">{t('tasks.priorityMedium')}</SelectItem>
              <SelectItem value="high">{t('tasks.priorityHigh')}</SelectItem>
              <SelectItem value="critical">{t('tasks.priorityCritical')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="gradient-card border-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">{t('common.noData')}</p>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                {t('tasks.addTask')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const project = projects.find(p => p.id === task.projectId);
            const assignee = members.find(m => m.id === task.assignedTo);
            
            return (
              <Card key={task.id} className="gradient-card border-0 shadow-md hover:shadow-primary transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          {t(`tasks.priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`)}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                          {t(`tasks.status${task.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`)}
                        </Badge>
                      </div>
                      {task.description && (
                        <CardDescription className="line-clamp-2">
                          {task.description}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(task)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteTaskId(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {project && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Filter className="h-3 w-3" />
                        <span>{project.name}</span>
                      </div>
                    )}
                    {assignee && (
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {assignee.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">{assignee.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Due {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('tasks.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tasks;
