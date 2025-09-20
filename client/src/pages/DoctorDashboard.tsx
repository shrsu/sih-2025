import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import { ModeToggle } from "@/themes/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Button } from "@/components/ui/button";
import TicketsSection from "@/components/doctor-dashboard/TicketsSection";
import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";

const BASE_URL = import.meta.env.VITE_BACKEND_URI;

function DoctorDashboard() {
  const navigate = useNavigate();
  const { entity } = useLoggedInEntity();
  const sidebarState: boolean = Cookies.get("sidebar_state") === "true";

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!entity?.loggedIn || entity.role !== "doctor") {
      navigate("/doctor/login");
    }
  }, [entity, navigate]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tickets`);
        setTickets(res.data);
      } catch (error) {
        console.error("Failed to fetch tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchTickets, 5000);
    fetchTickets();

    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider defaultOpen={sidebarState}>
      <AppSidebar />
      <main className="flex w-full flex-col min-h-screen">
        <header className="flex w-full justify-between pr-8 h-16 pl-4 py-4 sticky top-0 bg-background z-10">
          <Button size="icon" variant="outline">
            <SidebarTrigger />
          </Button>
          <ModeToggle />
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <span className="text-sm">Loading patients...</span>
          </div>
        ) : (
          <TicketsSection tickets={tickets} />
        )}
      </main>
    </SidebarProvider>
  );
}

export default DoctorDashboard;
