import React from "react";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { EmployeeSession, loadEmployee } from "@/services/activity-service";

interface EmployeeLookupProps {
  onLoaded: (session: EmployeeSession) => void;
}

export default function EmployeeLookup({
  onLoaded,
}: Readonly<EmployeeLookupProps>) {
  const [employeeId, setEmployeeId] = React.useState("");

  const { mutate, isLoading } = useMutation({
    ...loadEmployee(),
    onSuccess: (session) => {
      onLoaded(session);
    },
    onError: (error: Error) => {
      toast.error(`😓 Couldn't load employee ${employeeId}: ${error.message}`);
    },
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    mutate(employeeId);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="activity_employee_id">Employee ID</Label>
        <Input
          required
          id="activity_employee_id"
          inputMode="numeric"
          pattern="\d+"
          title="Numbers only"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
        <p className="text-[0.8rem] text-muted-foreground">
          Loads your name and project list.
        </p>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "LOADING..." : "LOAD PROJECTS"}
      </Button>
    </form>
  );
}
