import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  Project,
  Task,
  Member,
  Comment,
  Notification,
  Activity,
} from '@/types';
import {
  mockProjects,
  mockTasks,
  mockMembers,
  mockComments,
  mockNotifications,
  mockActivities,
} from '@/data/mockData';

interface AppContextType {
  // Projects
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Members
  members: Member[];
  addMember: (member: Member) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;

  // Comments
  comments: Comment[];
  addComment: (comment: Comment) => void;
  updateComment: (id: string, comment: Partial<Comment>) => void;
  deleteComment: (id: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;

  // Activities
  activities: Activity[];
  addActivity: (activity: Activity) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activities, setActivities] = useState<Activity[]>(mockActivities);

  // Projects
  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject, updatedAt: new Date() } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Tasks
  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedTask, updatedAt: new Date() } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Members
  const addMember = (member: Member) => {
    setMembers([...members, member]);
  };

  const updateMember = (id: string, updatedMember: Partial<Member>) => {
    setMembers(members.map(m => m.id === id ? { ...m, ...updatedMember } : m));
  };

  const deleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  // Comments
  const addComment = (comment: Comment) => {
    setComments([...comments, comment]);
  };

  const updateComment = (id: string, updatedComment: Partial<Comment>) => {
    setComments(comments.map(c => 
      c.id === id ? { ...c, ...updatedComment, updatedAt: new Date(), isEdited: true } : c
    ));
  };

  const deleteComment = (id: string) => {
    setComments(comments.filter(c => c.id !== id));
  };

  // Notifications
  const addNotification = (notification: Notification) => {
    setNotifications([notification, ...notifications]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Activities
  const addActivity = (activity: Activity) => {
    setActivities([activity, ...activities]);
  };

  return (
    <AppContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      tasks,
      addTask,
      updateTask,
      deleteTask,
      members,
      addMember,
      updateMember,
      deleteMember,
      comments,
      addComment,
      updateComment,
      deleteComment,
      notifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      activities,
      addActivity,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
