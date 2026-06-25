export type Role = 'MANAGER' | 'TEAM_LEAD' | 'EMPLOYEE';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  _id?: string;
  id?: string;
  userId?: string;
  username: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  teamLeadId?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: User;
  assignedTo: User;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}
