export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
}

export interface TaskUpdate {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface User {
  id: string;
  email: string;
  password: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  access_token: string;
}