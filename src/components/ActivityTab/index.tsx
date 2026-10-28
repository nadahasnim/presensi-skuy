import React from "react";
import Header from "../Header";
import EmployeeLookup from "../EmployeeLookup";
import FormActivity from "../Form/FormActivity";
import { EmployeeSession } from "@/services/activity-service";

// Step 1 looks up the employee, step 2 adds the activity.
// Header reset goes back to step 1.
export default function ActivityTab() {
  const [session, setSession] = React.useState<EmployeeSession | null>(null);

  return (
    <>
      <Header onReset={() => setSession(null)} />
      {session ? (
        <FormActivity session={session} />
      ) : (
        <EmployeeLookup onLoaded={setSession} />
      )}
    </>
  );
}
