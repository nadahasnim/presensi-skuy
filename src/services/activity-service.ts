import { ActivityFormSchema } from "@/components/Form/activity-form-config";
import { API_URL, DEFAULT_LAT_LNG } from "@/config/config";
import { nowWIB } from "@/lib/utils";
import {
  ActivityPayload,
  ProjectListPayload,
  TaskListPayload,
} from "@/types/request/activity";
import {
  ApiResponse,
  Employee,
  Project,
  Task,
} from "@/types/response/activity";
import axios, { AxiosResponse } from "axios";
import { z } from "zod";

// The API sometimes stalls; give up instead of leaving buttons loading forever.
const TIMEOUT = 15000;
const TASK_URI = `${API_URL}/daily_activity/manage_task`;

export type ProjectOption = { value: string; name: string; label: string };

export type EmployeeSession = {
  employeeId: string;
  employeeName: string;
  projects: ProjectOption[];
};

// Project names repeat across branches, so the subdivision goes in the label.
const toProjectOption = (project: Project): ProjectOption => {
  const subdivision = project.SUBDIVISI_NAME?.trim();

  return {
    value: String(project.PROJECT_ID),
    name: project.PROJECT_NAME,
    label:
      subdivision && subdivision !== "-"
        ? `${project.PROJECT_NAME} · ${subdivision}`
        : project.PROJECT_NAME,
  };
};

// Employee name and project list are both needed before the activity form shows.
// Unknown IDs come back as a 500 without CORS headers, so axios reports "Network Error".
export const loadEmployee = () => {
  const STAFF_URI = `${API_URL}/absensi/staffdata`;
  const PROJECT_URI = `${API_URL}/absensi/manage_project`;

  return {
    mutationKey: [STAFF_URI, PROJECT_URI],
    mutationFn: async (employeeId: string): Promise<EmployeeSession> => {
      const projectPayload: ProjectListPayload = {
        action: "list",
        EMPLOYEE_ID: Number(employeeId),
      };

      const [{ data: staff }, { data: projects }] = await Promise.all([
        axios.get<ApiResponse<Employee[]>>(
          `${STAFF_URI}/${encodeURIComponent(employeeId)}`,
          { timeout: TIMEOUT }
        ),
        axios.post<ApiResponse<Project[] | string>>(PROJECT_URI, projectPayload, {
          timeout: TIMEOUT,
        }),
      ]);

      const employeeName = staff.message?.[0]?.EMPLOYEE_NAME;
      if (!employeeName) {
        throw new Error("Employee not found.");
      }

      if (!Array.isArray(projects.message) || !projects.message.length) {
        throw new Error(
          typeof projects.message === "string"
            ? projects.message
            : "No projects found."
        );
      }

      return {
        employeeId,
        employeeName,
        projects: projects.message.map(toProjectOption),
      };
    },
  };
};

export const submitActivity = (session: EmployeeSession) => {
  return {
    mutationKey: [TASK_URI, "insert"],
    mutationFn: async (
      data: z.infer<typeof ActivityFormSchema>
    ): Promise<AxiosResponse<{ message: string; status: string }>> => {
      const project = session.projects.find((p) => p.value === data.project_id);
      if (!project) {
        throw new Error("Project must be selected.");
      }

      // Not backdated: the task is stamped with the current WIB date and time.
      const when = data.backdate ? data : nowWIB();

      const payload: ActivityPayload = {
        action: "insert",
        EMPLOYEE_ID: session.employeeId,
        PROJECT_NAME: project.name,
        TASK_PROJECT_ID: project.value,
        TASK_LAT: DEFAULT_LAT_LNG.lat.toString(),
        TASK_LNG: DEFAULT_LAT_LNG.lng.toString(),
        TASK_ASSIGNED_TO: "",
        TASK_PROGRESS: data.progress,
        TASK_DESC: data.information,
        TASK_BACKDATE: data.backdate ? "1" : "0",
        TASK_DATE: when.date,
        TASK_TIME: when.time,
        TASK_START_TIME: "",
        TASK_END_TIME: "",
        TASK_CAT_ID: "",
        TASK_COMPLETION_TIME: "",
        JOB_VOLUME: "",
        TASK_WORK_LOCATION: "",
        TASK_WORK_LOCATION_DESC: "",
        TASK_WORK_TYPE: "",
        TASK_TRANSPORT_TYPE: "",
        TASK_DURATION_H: "",
        TASK_DURATION_M: "",
      };

      return axios.postForm(TASK_URI, payload, { timeout: TIMEOUT });
    },
  };
};

// Tasks dated today (WIB) for this employee.
export const getTodayTasks = (employeeId: string) => {
  const { date } = nowWIB();

  return {
    queryKey: [TASK_URI, "list", employeeId, date],
    queryFn: async (): Promise<Task[]> => {
      const payload: TaskListPayload = {
        action: "list",
        EMPLOYEE_ID: Number(employeeId),
        TASK_START_DATE: date,
        TASK_END_DATE: date,
        TASK_EMPLOYEE_ID: "",
        TASK_PROJECT_ID: "",
      };

      const { data } = await axios.post<ApiResponse<Task[] | string>>(
        TASK_URI,
        payload,
        { timeout: TIMEOUT }
      );

      if (!Array.isArray(data.message)) {
        throw new Error(data.message || "Failed to load tasks.");
      }

      return data.message;
    },
  };
};
