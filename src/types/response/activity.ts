// Only the fields the app reads; the API returns many more.
export type ApiResponse<T> = {
  status: string;
  message: T;
};

export type Employee = {
  EMPLOYEE_ID: number;
  EMPLOYEE_NAME: string;
};

export type Project = {
  PROJECT_ID: number;
  PROJECT_NAME: string;
  SUBDIVISI_NAME: string | null;
};

export type Task = {
  TASK_ID: number;
  PROJECT_NAME: string;
  TASK_DESC: string;
  TASK_DATE: string;
  TASK_TIME: string;
  TASK_PROGRESS: number;
};
