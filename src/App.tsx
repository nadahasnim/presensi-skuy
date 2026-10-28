import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema, defaultValues } from "./components/Form/form-config";
import FormPresence from "./components/Form/FormPresence";
import { Form } from "./components/ui/form";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import SecureCheck from "./components/SecureCheck";
import Container from "./components/Container";
import ActivityTab from "./components/ActivityTab";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import React from "react";

const queryClient = new QueryClient();

// forceMount + hidden keeps each tab's form state (and the map) alive while switching.
const tabContentClass = "data-[state=inactive]:hidden";

function App() {
  const [isAllowed, setIsAllowed] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues,
  });

  const handleCheck = (allowed: boolean) => {
    setIsAllowed(allowed);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {!isAllowed ? (
        <SecureCheck onCheck={handleCheck} />
      ) : (
        <Container className="py-6 pt-20">
          <Tabs defaultValue="presence">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="presence">Presence</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="presence" forceMount className={tabContentClass}>
              <Form {...form}>
                <Header onReset={() => form.reset()} />
                <FormPresence />
              </Form>
            </TabsContent>
            <TabsContent value="activity" forceMount className={tabContentClass}>
              <ActivityTab />
            </TabsContent>
          </Tabs>
        </Container>
      )}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
