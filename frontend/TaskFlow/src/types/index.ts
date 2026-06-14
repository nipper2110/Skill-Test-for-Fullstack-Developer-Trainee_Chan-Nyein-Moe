export interface User {
  id: string;
  fullName: string;
  title: string;
  email: string;
  initials: string;
  avatarColor: string;
  avatarUrl: string | null;
}

export interface Task {
  id: string;
  taskName: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  createdById: string;
  assignmentLabel: string;
  canEdit: boolean;
  canDelete: boolean;
  avatar: string;
  avatarColor: string;
  category: string;
  categoryId: string;
  status: string;
  statusRaw: string;
  statusColor: string;
  statusBgColor: string;
  dueDate: string;
  dueDateRaw: string;
  tags: string[];
}

export interface Category {
  id: string;
  categoryName: string;
  description: string;
  selectedIcon: string;
  selectedColor: string;
  activeTasksCount: number;
  progressValue: number;
}

export interface Invitation {
  id: string;
  invitedBy: string;
  taskName: string;
  role?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Member" | "Admin";
  invitationStatus: "PENDING" | "ACCEPTED" | null;
}

export interface OverdueTask extends Task {
  daysDelayed: number;
}

export interface DeadlineItem {
  taskName: string;
  project: string;
  dueDate: string;
}
