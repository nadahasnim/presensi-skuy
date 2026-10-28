import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  ActivityFormSchema,
  activityDefaultValues,
} from "./activity-form-config";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import TodayTasks from "../TodayTasks";
import TimeSelect from "../TimeSelect";
import { EmployeeSession, submitActivity } from "@/services/activity-service";
import { cn, nowWIB, openPicker } from "@/lib/utils";

interface FormActivityProps {
  session: EmployeeSession;
}

export default function FormActivity({ session }: Readonly<FormActivityProps>) {
  const [projectOpen, setProjectOpen] = React.useState(false);

  const form = useForm<z.infer<typeof ActivityFormSchema>>({
    resolver: zodResolver(ActivityFormSchema),
    defaultValues: activityDefaultValues,
  });

  const { mutate, isLoading } = useMutation({
    ...submitActivity(session),
    onSuccess: (data) => {
      const { data: response } = data;

      if (response.status === "err") {
        toast.error(`😓 ${response.message}`);
      } else {
        toast.success(`😃 ${response.message}`);
        form.reset();
      }
    },
    onError: (error: Error) => {
      toast.error(`😓 ${error.message}`);
    },
  });

  function onSubmit(data: z.infer<typeof ActivityFormSchema>) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Employee info + today's task list */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 text-sm">
            <p className="truncate font-medium">{session.employeeName}</p>
            <p className="text-muted-foreground">
              Employee ID: {session.employeeId}
            </p>
          </div>
          <TodayTasks
            employeeId={session.employeeId}
            employeeName={session.employeeName}
          />
        </div>

        {/* Searchable project dropdown (one employee can have hundreds) */}
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Project</FormLabel>
              <Popover open={projectOpen} onOpenChange={setProjectOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <span className="truncate">
                        {session.projects.find((p) => p.value === field.value)
                          ?.label ?? "Select project"}
                      </span>
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  {/* substring match on the label; cmdk's default fuzzy match is too loose here */}
                  <Command
                    filter={(_value, search, keywords) =>
                      keywords?.[0]?.toLowerCase().includes(search.toLowerCase())
                        ? 1
                        : 0
                    }
                  >
                    <CommandInput placeholder="Search project..." />
                    <CommandList>
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {session.projects.map((project) => (
                          <CommandItem
                            key={project.value}
                            value={project.value}
                            keywords={[project.label]}
                            onSelect={() => {
                              field.onChange(project.value);
                              setProjectOpen(false);
                            }}
                          >
                            {project.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                project.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Progress */}
        <FormField
          control={form.control}
          name="progress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Progress (%)</FormLabel>
              <FormControl>
                <Input inputMode="numeric" placeholder="0 - 100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Information Activity */}
        <FormField
          control={form.control}
          name="information"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Information</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Activity description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Backdate */}
        <FormField
          control={form.control}
          name="backdate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked === true);
                    // prefill with the current WIB time so the user only tweaks it
                    if (checked === true) {
                      const now = nowWIB();
                      form.setValue("date", now.date);
                      form.setValue("time", now.time);
                    }
                  }}
                />
              </FormControl>
              <FormLabel>Set date?</FormLabel>
            </FormItem>
          )}
        />

        {/* DATE TIME */}
        {form.watch("backdate") && (
          <div className="flex justify-stretch gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        max={nowWIB().date}
                        onClick={openPicker}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <TimeSelect value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button disabled={isLoading} type="submit">
          ADD ACTIVITY
        </Button>
      </form>
    </Form>
  );
}
