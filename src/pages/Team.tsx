import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { Member, MemberRole, MemberStatus } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Mail, Pencil, Trash2, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Team: React.FC = () => {
  const { t } = useLanguage();
  const { members, projects, tasks, addMember, updateMember, deleteMember } = useApp();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<MemberRole | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'developer' as MemberRole,
    skills: '',
    status: 'available' as MemberStatus,
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenDialog = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        skills: member.skills.join(', '),
        status: member.status,
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        email: '',
        role: 'developer',
        skills: '',
        status: 'available',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: t('common.error'),
        description: 'Name and email are required',
        variant: 'destructive',
      });
      return;
    }

    const skillsArray = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (editingMember) {
      updateMember(editingMember.id, {
        ...formData,
        skills: skillsArray,
      });
      toast({
        title: t('common.success'),
        description: 'Member updated successfully',
      });
    } else {
      const newMember: Member = {
        id: `m${Date.now()}`,
        ...formData,
        avatar: formData.name.charAt(0).toUpperCase(),
        skills: skillsArray,
        createdAt: new Date(),
      };
      addMember(newMember);
      toast({
        title: t('common.success'),
        description: 'Member added successfully',
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteMemberId) {
      deleteMember(deleteMemberId);
      toast({
        title: t('common.success'),
        description: 'Member removed successfully',
      });
      setDeleteMemberId(null);
    }
  };

  const getStatusColor = (status: MemberStatus) => {
    const colors: Record<MemberStatus, string> = {
      'available': 'bg-success/10 text-success border-success/20',
      'busy': 'bg-warning/10 text-warning border-warning/20',
      'away': 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20',
    };
    return colors[status];
  };

  const getMemberStats = (memberId: string) => {
    const assignedProjects = projects.filter(p => p.members.includes(memberId));
    const assignedTasks = tasks.filter(t => t.assignedTo === memberId);
    const completedTasks = assignedTasks.filter(t => t.status === 'done');
    
    return {
      projects: assignedProjects.length,
      tasks: assignedTasks.length,
      completedTasks: completedTasks.length,
    };
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('team.title')}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your team members
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('team.addMember')}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? t('team.editMember') : t('team.addMember')}
                </DialogTitle>
                <DialogDescription>
                  Fill in the member details below
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('team.fullName')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('team.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('team.role')}</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value as MemberRole })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="admin">{t('team.roleAdmin')}</SelectItem>
                        <SelectItem value="project-manager">{t('team.roleProjectManager')}</SelectItem>
                        <SelectItem value="developer">{t('team.roleDeveloper')}</SelectItem>
                        <SelectItem value="designer">{t('team.roleDesigner')}</SelectItem>
                        <SelectItem value="tester">{t('team.roleTester')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">{t('team.status')}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as MemberStatus })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="available">{t('team.statusAvailable')}</SelectItem>
                        <SelectItem value="busy">{t('team.statusBusy')}</SelectItem>
                        <SelectItem value="away">{t('team.statusAway')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">{t('team.skills')}</Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="React, TypeScript, Node.js (comma separated)"
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
        <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
          <SelectTrigger className="w-full sm:w-48 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">{t('team.roleAdmin')}</SelectItem>
            <SelectItem value="project-manager">{t('team.roleProjectManager')}</SelectItem>
            <SelectItem value="developer">{t('team.roleDeveloper')}</SelectItem>
            <SelectItem value="designer">{t('team.roleDesigner')}</SelectItem>
            <SelectItem value="tester">{t('team.roleTester')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.length === 0 ? (
          <Card className="col-span-full gradient-card border-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">{t('common.noData')}</p>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                {t('team.addMember')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredMembers.map((member) => {
            const stats = getMemberStats(member.id);
            
            return (
              <Card key={member.id} className="gradient-card border-0 shadow-md hover:shadow-primary transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getStatusColor(member.status)}`}>
                            {t(`team.status${member.status.charAt(0).toUpperCase() + member.status.slice(1)}`)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenDialog(member)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteMemberId(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      <span>
                        {t(`team.role${member.role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`)}
                      </span>
                    </div>
                  </div>

                  {member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {member.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="text-center space-y-1">
                      <p className="text-xs text-muted-foreground">Projects</p>
                      <p className="text-lg font-semibold">{stats.projects}</p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs text-muted-foreground">Tasks</p>
                      <p className="text-lg font-semibold">{stats.tasks}</p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs text-muted-foreground">Done</p>
                      <p className="text-lg font-semibold">{stats.completedTasks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteMemberId} onOpenChange={() => setDeleteMemberId(null)}>
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('team.deleteConfirm')}
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

export default Team;
