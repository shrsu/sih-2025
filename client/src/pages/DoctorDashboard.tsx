import { useEffect, useState, useRef } from "react";
import { ModeToggle } from "@/themes/mode-toggle";
import Cookies from "js-cookie";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Button } from "@/components/ui/button";
import PatientsSection from "@/components/doctor-dashboard/PatientsSection";

const BASE_URL = import.meta.env.VITE_BACKEND_URI;

const phoneMetadata: Record<
  string,
  { name: string; gender: "male" | "female" }
> = {
  "+919317524556": { name: "Sujal Shrestha", gender: "male" },
  "+918199075665": { name: "Ananya Tewari", gender: "female" },
  "+919882716924": { name: "Abhinandan Gupta", gender: "male" },
  "+917018224197": { name: "Anshul Kashyap", gender: "male" },
  "+919882182880": { name: "Satyam Sharma", gender: "male" },
  "+918295057353": { name: "Swasti Mohanty", gender: "female" },
};

function DoctorDashboard() {
  const sidebarState: boolean = Cookies.get("sidebar_state") === "true";

  const [enrichedCalls, setEnrichedCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const existingIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await fetch(`${BASE_URL}/calls/completed`);
        const data = await res.json();

        const newEnriched = data
          .filter((call: any) => !existingIdsRef.current.has(call._id))
          .map((call: any) => {
            const meta = phoneMetadata[call.phoneNumber];
            if (!meta || !call.aiAnalysis) return null;

            existingIdsRef.current.add(call._id);

            return {
              _id: call._id,
              name: meta.name,
              gender: meta.gender,
              aiAnalysis: call.aiAnalysis,
              createdAt: call.createdAt,
            };
          })
          .filter(Boolean);

        if (newEnriched.length > 0) {
          setEnrichedCalls((prev) => [...prev, ...newEnriched]);
        }
      } catch (error) {
        console.error("Failed to fetch completed calls:", error);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchCalls, 5000);
    fetchCalls();

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
          <PatientsSection calls={enrichedCalls} />
        )}
      </main>
    </SidebarProvider>
  );
}

export default DoctorDashboard;
