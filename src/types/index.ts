// Type definitions for the Project Management App

export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed';
export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type MemberRole = 'admin' | 'project-manager' | 'developer' | 'designer' | 'tester';
export type MemberStatus = 'available' | 'busy' | 'away';
export type NotificationType = 'task' | 'comment' | 'project' | 'system';
export type NotificationPriority = 'high' | 'normal' | 'low';
export type Language = 'en' | 'fr';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  members: string[]; // member IDs
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string; // member ID
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatar: string;
  skills: string[];
  status: MemberStatus;
  createdAt: Date;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  mentions: string[]; // member IDs
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  entityType: 'project' | 'task' | 'member' | 'comment';
  entityId: string;
  timestamp: Date;
}
