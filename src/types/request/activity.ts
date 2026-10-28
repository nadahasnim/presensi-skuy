export type ProjectListPayload = {
  action: "list";
  EMPLOYEE_ID: number;
};

export type TaskListPayload = {
  action: "list";
  EMPLOYEE_ID: number;
  TASK_START_DATE: string;
  TASK_END_DATE: string;
  TASK_EMPLOYEE_ID: string;
  TASK_PROJECT_ID: string;
};

// Sent as multipart form data; the API expects every key, even unused ones.
export type ActivityPayload = {
  action: "insert";
  EMPLOYEE_ID: string;
  PROJECT_NAME: string;
  TASK_PROJECT_ID: string;
  TASK_LAT: string;
  TASK_LNG: string;
  TASK_ASSIGNED_TO: string;
  TASK_PROGRESS: string;
  TASK_DESC: string;
  TASK_BACKDATE: string;
  TASK_DATE: string;
  TASK_TIME: string;
  TASK_START_TIME: string;
  TASK_END_TIME: string;
  TASK_CAT_ID: string;
  TASK_COMPLETION_TIME: string;
  JOB_VOLUME: string;
  TASK_WORK_LOCATION: string;
  TASK_WORK_LOCATION_DESC: string;
  TASK_WORK_TYPE: string;
  TASK_TRANSPORT_TYPE: string;
  TASK_DURATION_H: string;
  TASK_DURATION_M: string;
};
