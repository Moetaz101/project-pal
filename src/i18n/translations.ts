import { Language } from '@/types';

export const translations = {
  en: {
    // Common
    common: {
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      noData: 'No data available',
      success: 'Success',
      error: 'Error',
      welcome: 'Welcome',
      logout: 'Logout',
    },

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      tasks: 'Tasks',
      team: 'Team',
      notifications: 'Notifications',
      more: 'More',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      totalProjects: 'Total Projects',
      activeTasks: 'Active Tasks',
      pendingNotifications: 'Notifications',
      teamMembers: 'Team Members',
      recentActivity: 'Recent Activity',
      upcomingDeadlines: 'Upcoming Deadlines',
      myTasks: 'My Tasks',
    },

    // Projects
    projects: {
      title: 'Projects',
      addProject: 'Add Project',
      editProject: 'Edit Project',
      projectName: 'Project Name',
      description: 'Description',
      startDate: 'Start Date',
      endDate: 'End Date',
      status: 'Status',
      members: 'Members',
      progress: 'Progress',
      deleteConfirm: 'Are you sure you want to delete this project?',
      statusPlanning: 'Planning',
      statusActive: 'Active',
      statusOnHold: 'On Hold',
      statusCompleted: 'Completed',
    },

    // Tasks
    tasks: {
      title: 'Tasks',
      addTask: 'Add Task',
      editTask: 'Edit Task',
      taskTitle: 'Task Title',
      description: 'Description',
      priority: 'Priority',
      status: 'Status',
      assignedTo: 'Assigned To',
      dueDate: 'Due Date',
      project: 'Project',
      deleteConfirm: 'Are you sure you want to delete this task?',
      statusTodo: 'To Do',
      statusInProgress: 'In Progress',
      statusInReview: 'In Review',
      statusDone: 'Done',
      priorityLow: 'Low',
      priorityMedium: 'Medium',
      priorityHigh: 'High',
      priorityCritical: 'Critical',
    },

    // Team
    team: {
      title: 'Team',
      addMember: 'Add Member',
      editMember: 'Edit Member',
      fullName: 'Full Name',
      email: 'Email',
      role: 'Role',
      skills: 'Skills',
      status: 'Status',
      assignedProjects: 'Assigned Projects',
      deleteConfirm: 'Are you sure you want to remove this member?',
      roleAdmin: 'Admin',
      roleProjectManager: 'Project Manager',
      roleDeveloper: 'Developer',
      roleDesigner: 'Designer',
      roleTester: 'Tester',
      statusAvailable: 'Available',
      statusBusy: 'Busy',
      statusAway: 'Away',
    },

    // Comments
    comments: {
      title: 'Comments',
      addComment: 'Add Comment',
      editComment: 'Edit Comment',
      writeComment: 'Write a comment...',
      mention: 'Mention someone with @',
      deleteConfirm: 'Are you sure you want to delete this comment?',
      edited: 'Edited',
      noComments: 'No comments yet',
    },

    // Notifications
    notifications: {
      title: 'Notifications',
      markAsRead: 'Mark as read',
      markAllRead: 'Mark all as read',
      clearRead: 'Clear read',
      noNotifications: 'No notifications',
      typeTask: 'Task',
      typeComment: 'Comment',
      typeProject: 'Project',
      typeSystem: 'System',
    },
  },

  fr: {
    // Common
    common: {
      add: 'Ajouter',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      search: 'Rechercher',
      filter: 'Filtrer',
      loading: 'Chargement...',
      noData: 'Aucune donnée disponible',
      success: 'Succès',
      error: 'Erreur',
      welcome: 'Bienvenue',
      logout: 'Déconnexion',
    },

    // Navigation
    nav: {
      dashboard: 'Tableau de bord',
      projects: 'Projets',
      tasks: 'Tâches',
      team: 'Équipe',
      notifications: 'Notifications',
      more: 'Plus',
    },

    // Dashboard
    dashboard: {
      title: 'Tableau de bord',
      totalProjects: 'Total Projets',
      activeTasks: 'Tâches Actives',
      pendingNotifications: 'Notifications',
      teamMembers: 'Membres de l\'équipe',
      recentActivity: 'Activité Récente',
      upcomingDeadlines: 'Échéances à venir',
      myTasks: 'Mes Tâches',
    },

    // Projects
    projects: {
      title: 'Projets',
      addProject: 'Ajouter un projet',
      editProject: 'Modifier le projet',
      projectName: 'Nom du projet',
      description: 'Description',
      startDate: 'Date de début',
      endDate: 'Date de fin',
      status: 'Statut',
      members: 'Membres',
      progress: 'Progrès',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce projet?',
      statusPlanning: 'Planification',
      statusActive: 'Actif',
      statusOnHold: 'En attente',
      statusCompleted: 'Terminé',
    },

    // Tasks
    tasks: {
      title: 'Tâches',
      addTask: 'Ajouter une tâche',
      editTask: 'Modifier la tâche',
      taskTitle: 'Titre de la tâche',
      description: 'Description',
      priority: 'Priorité',
      status: 'Statut',
      assignedTo: 'Assigné à',
      dueDate: 'Date d\'échéance',
      project: 'Projet',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cette tâche?',
      statusTodo: 'À faire',
      statusInProgress: 'En cours',
      statusInReview: 'En révision',
      statusDone: 'Terminé',
      priorityLow: 'Basse',
      priorityMedium: 'Moyenne',
      priorityHigh: 'Haute',
      priorityCritical: 'Critique',
    },

    // Team
    team: {
      title: 'Équipe',
      addMember: 'Ajouter un membre',
      editMember: 'Modifier le membre',
      fullName: 'Nom complet',
      email: 'Email',
      role: 'Rôle',
      skills: 'Compétences',
      status: 'Statut',
      assignedProjects: 'Projets assignés',
      deleteConfirm: 'Êtes-vous sûr de vouloir retirer ce membre?',
      roleAdmin: 'Administrateur',
      roleProjectManager: 'Chef de projet',
      roleDeveloper: 'Développeur',
      roleDesigner: 'Designer',
      roleTester: 'Testeur',
      statusAvailable: 'Disponible',
      statusBusy: 'Occupé',
      statusAway: 'Absent',
    },

    // Comments
    comments: {
      title: 'Commentaires',
      addComment: 'Ajouter un commentaire',
      editComment: 'Modifier le commentaire',
      writeComment: 'Écrire un commentaire...',
      mention: 'Mentionner quelqu\'un avec @',
      deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce commentaire?',
      edited: 'Modifié',
      noComments: 'Aucun commentaire',
    },

    // Notifications
    notifications: {
      title: 'Notifications',
      markAsRead: 'Marquer comme lu',
      markAllRead: 'Tout marquer comme lu',
      clearRead: 'Effacer les lus',
      noNotifications: 'Aucune notification',
      typeTask: 'Tâche',
      typeComment: 'Commentaire',
      typeProject: 'Projet',
      typeSystem: 'Système',
    },
  },
};

export const useTranslation = (lang: Language) => {
  return (key: string) => {
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };
};
