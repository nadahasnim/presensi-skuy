import { z } from "zod";

export const ActivityFormSchema = z
  .object({
    project_id: z.string().min(1, { message: "Project must be selected." }),
    progress: z.string().regex(/^(100|\d{1,2})$/, {
      message: "Progress must be a number from 0 to 100.",
    }),
    information: z
      .string()
      .min(3, { message: "Information must be at least 3 characters." }),
    backdate: z.boolean(),
    date: z.string(),
    time: z.string(),
  })
  .refine((data) => !data.backdate || Boolean(data.date && data.time), {
    message: "Date and time are required.",
    path: ["date"],
  });

export const activityDefaultValues: z.infer<typeof ActivityFormSchema> = {
  project_id: "",
  progress: "",
  information: "",
  backdate: false,
  date: "",
  time: "",
};
