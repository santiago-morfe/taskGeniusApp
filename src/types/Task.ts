export interface TaskDto {
  id: number;
  title: string | null;
  description: string | null;
  dueDate?: string | null; // ISO 8601 date-time
  isCompleted: boolean;
  userId?: string | null;
  createdAt: string; // ISO 8601 date-time
}

export interface CreateTaskDto {
  title?: string | null;
  description?: string | null;
  dueDate?: string | null; // ISO 8601 date-time
  isCompleted: boolean;
}

export interface UpdateTaskDto {
  id: number;
  title?: string | null;
  description?: string | null;
  dueDate?: string | null; // ISO 8601 date-time
  isCompleted?: boolean;
  userId?: string | null;
}