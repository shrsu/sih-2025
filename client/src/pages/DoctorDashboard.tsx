import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import { ModeToggle } from "@/themes/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TicketsSection from "@/components/doctor-dashboard/TicketsSection";
import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";
import { 
  Stethoscope, 
  Users, 
  Clock, 
  RefreshCw, 
  AlertCircle, 
  Activity,
  Bell,
  Search,
  Filter
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URI;

function DoctorDashboard() {
  const navigate = useNavigate();
  const { entity } = useLoggedInEntity();
  const sidebarState: boolean = Cookies.get("sidebar_state") === "true";

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const firstLoadDone = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (entity === null) return;
    if (!entity.loggedIn || entity.role !== "doctor") {
      navigate("/doctor/login");
    }
  }, [entity, navigate]);

  // Fetch tickets function
  const fetchTickets = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsPolling(true);
    }

    try {
      console.log("Fetching tickets...");
      const res = await axios.get(`${BASE_URL}/tickets`);
      setTickets(res.data);
      setError(null);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setError("Failed to load patient tickets. Please try again.");
    } finally {
      if (!firstLoadDone.current) {
        setLoading(false);
        firstLoadDone.current = true;
      }
      if (isManualRefresh) {
        setIsPolling(false);
      }
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    fetchTickets();

    // Set up polling interval
    intervalRef.current = setInterval(() => fetchTickets(), 30000); // Increased to 30 seconds for better UX

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchTickets(true);
  };

  // Retry handler for errors
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    firstLoadDone.current = false;
    fetchTickets();
  };

  // Calculate dashboard stats
  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'pending' || !t.status).length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    completed: tickets.filter(t => t.status === 'completed').length,
  };

  // Loading state
  if (loading) {
    return (
      <SidebarProvider defaultOpen={sidebarState}>
        <AppSidebar />
        <main className="flex w-full flex-col min-h-screen">
          <header className="flex w-full justify-between pr-8 h-16 pl-4 py-4 sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
            <Button size="icon" variant="outline">
              <SidebarTrigger />
            </Button>
            <ModeToggle />
          </header>

          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Loading Dashboard</h3>
              <p className="text-sm text-muted-foreground">Fetching your patient tickets...</p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>Connecting to server</span>
            </div>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={sidebarState}>
      <AppSidebar />
      <main className="flex w-full flex-col min-h-screen bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Enhanced Header */}
        <header className="flex w-full justify-between items-center pr-8 h-16 pl-4 py-4 sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="outline">
              <SidebarTrigger />
            </Button>
            
            {/* Welcome section */}
            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">Doctor Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  {entity?.name ? `Welcome back, ${entity.name}` : "Welcome back"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats badge */}
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
              <Users className="w-3 h-3" />
              {stats.total} patients
            </Badge>

            {/* Refresh button */}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isPolling}
              className="relative"
            >
              <RefreshCw className={`w-4 h-4 ${isPolling ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline ml-2">Refresh</span>
            </Button>

            <ModeToggle />
          </div>
        </header>

        {/* Dashboard Stats */}
        <div className="px-6 py-4 border-b border-border bg-background/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800/50 rounded-lg border border-border">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Tickets</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800/50 rounded-lg border border-border">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-800/50 rounded-lg border border-border">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="px-6 py-4">
            <Alert className="border-destructive/20 bg-destructive/5">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRetry}
                  className="ml-4"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {tickets.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Patient Tickets</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                You don't have any patient tickets at the moment. New appointments and consultations will appear here.
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Check for Updates
              </Button>
            </div>
          ) : (
            <TicketsSection tickets={tickets} />
          )}
        </div>
      </main>
    </SidebarProvider>
  );
}

export default DoctorDashboard;