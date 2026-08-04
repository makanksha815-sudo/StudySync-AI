import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppProvider } from '@/context/app-context';
import { Layout } from '@/components/layout';

// Pages
import Landing from '@/pages/index';
import Dashboard from '@/pages/dashboard';
import Planner from '@/pages/planner';
import CalendarPage from '@/pages/calendar';
import Tasks from '@/pages/tasks';
import Pomodoro from '@/pages/pomodoro';
import Analytics from '@/pages/analytics';
import Goals from '@/pages/goals';
import Notes from '@/pages/notes';
import Settings from '@/pages/settings';

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/planner" component={Planner} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/pomodoro" component={Pomodoro} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/goals" component={Goals} />
        <Route path="/notes" component={Notes} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
