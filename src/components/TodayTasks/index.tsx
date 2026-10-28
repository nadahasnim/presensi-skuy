import React from "react";
import { useQuery } from "react-query";
import { ListChecks } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { getTodayTasks } from "@/services/activity-service";
import { Task } from "@/types/response/activity";
import { nowWIB } from "@/lib/utils";

interface TodayTasksProps {
  employeeId: string;
  employeeName: string;
}

export default function TodayTasks({
  employeeId,
  employeeName,
}: Readonly<TodayTasksProps>) {
  const [open, setOpen] = React.useState(false);

  // Fetches whenever the dialog opens, so tasks added since then show up.
  const { data: tasks, error } = useQuery<Task[], Error>({
    ...getTodayTasks(employeeId),
    enabled: open,
    retry: false,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* type="button": this sits inside the activity form and must not submit it */}
        <Button type="button" variant="outline" size="sm">
          <ListChecks /> Today&apos;s tasks
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] rounded-lg">
        <DialogHeader>
          <DialogTitle>Today&apos;s tasks</DialogTitle>
          <DialogDescription>
            {employeeName} ({employeeId}) · {nowWIB().date}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="text-sm text-destructive">😓 {error.message}</p>
        ) : !tasks ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : !tasks.length ? (
          <p className="text-sm text-muted-foreground">No tasks yet today.</p>
        ) : (
          <ul className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
            {tasks.map((task) => (
              <li
                key={task.TASK_ID}
                className="flex flex-col gap-1 rounded-lg border p-3"
              >
                <div className="flex justify-between gap-2 text-sm font-medium">
                  <span>{task.PROJECT_NAME}</span>
                  <span className="shrink-0">{task.TASK_PROGRESS}%</span>
                </div>
                <p className="text-sm text-muted-foreground">{task.TASK_DESC}</p>
                <p className="text-xs text-muted-foreground">{task.TASK_TIME}</p>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
