import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { RoleProvider } from "@/hooks/use-role";

// Pages
import Dashboard from "@/pages/Dashboard";
import StudentsList from "@/pages/StudentsList";
import StudentProfile from "@/pages/StudentProfile";
import Fees from "@/pages/Fees";
import Academics from "@/pages/Academics";
import Attendance from "@/pages/Attendance";
import Permissions from "@/pages/Permissions";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/students" component={StudentsList} />
        <Route path="/students/:id" component={StudentProfile} />
        <Route path="/fees" component={Fees} />
        <Route path="/academics" component={Academics} />
        <Route path="/attendance" component={Attendance} />
        <Route path="/permissions" component={Permissions} />
        <Route path="/settings" component={Settings} />
        <Route path="/reports" component={Reports} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </RoleProvider>
    </QueryClientProvider>
  );
}

export default App;
