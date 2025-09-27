import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/themes/mode-toggle";
import {
  User,
  Phone,
  ClipboardList,
  FileText,
  Pill,
  ChevronDown,
  ChevronUp,
  LogOut,
  Calendar,
  Activity,
  Shield,
  Sparkles,
} from "lucide-react";
import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

interface AiAnalysis {
  shortSummary?: string;
  detailedSummary?: string;
  transcript?: string;
}

interface Summary {
  id: string;
  aiAnalysis?: AiAnalysis;
  prescription?: {
    text?: string;
    prescribedBy?: string;
  };
}

interface TicketPrescription {
  prescription: string;
  prescribedBy: string;
}

interface Ticket {
  _id: string;
  phoneNumber: string;
  name?: string;
  gender?: string;
  summaries?: Summary[];
  prescriptions?: TicketPrescription[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSummaries, setExpandedSummaries] = useState<
    Record<string, boolean>
  >({});
  const [sideBySide, setSideBySide] = useState(false);
  const { entity, setEntity } = useLoggedInEntity();

  useEffect(() => {
    if (!entity?.loggedIn || entity.role !== "user") {
      navigate("/user/login");
    }
  }, [entity, navigate]);

  useEffect(() => {
    if (!entity?.id || entity.role !== "user") return;

    const fetchTickets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URI}/tickets/by-phone`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phoneNumber: entity.id }),
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 404) {
            setTickets([]);
          } else {
            setError(data?.error || "Failed to fetch your tickets");
            setTickets([]);
          }
        } else {
          const input: Ticket[] = Array.isArray(data) ? data : [];
          const byId = new Map<string, Ticket>();
          for (const t of input) {
            if (!t || !t._id) continue;
            const seenSummary = new Set<string>();
            const uniqueSummaries = (t.summaries || []).filter((s) => {
              const sid = String(s.id);
              if (!sid || seenSummary.has(sid)) return false;
              seenSummary.add(sid);
              return true;
            });
            const cleaned: Ticket = { ...t, summaries: uniqueSummaries };
            byId.set(t._id, cleaned);
          }
          setTickets(Array.from(byId.values()));
        }
      } catch (e) {
        setError("Failed to fetch your tickets");
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [entity?.id, entity?.role]);

  const toggleSummary = (compositeId: string) => {
    setExpandedSummaries((prev) => ({
      ...prev,
      [compositeId]: !prev[compositeId],
    }));
  };

  const handleLogout = () => {
    setEntity(null);
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 flex flex-col">
      {/* Header */}
      <header className="flex w-full justify-between items-center px-6 py-6 sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              Your Health Records
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              View your consultation summaries and prescriptions
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            className="border-slate-300 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
          </Button>
          <ModeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 w-full">
        {/* User Info */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {entity?.id || "Unknown"}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Your unique identifier
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
              <Shield className="w-4 h-4" />
              <span>Keep this number safe for accessing your records</span>
            </div>
          </div>
        </div>

        {/* Tickets */}
        <div className="space-y-6">
          {loading && (
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="font-medium">Loading your records...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="text-red-800 dark:text-red-300 font-medium">{error}</div>
            </div>
          )}

          {!loading && !error && tickets.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No records found yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Your consultation history will appear here once you have sessions
              </p>
            </div>
          )}

          {tickets.map((t) => (
            <div
              key={t._id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Ticket header */}
              <div className="p-6 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/30 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                      {t.name || "Unnamed Patient"}
                      {t.gender && (
                        <span className="ml-2 text-sm bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-lg">
                          {t.gender}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm mt-2 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" /> {t._id}
                      </div>
                      {t.createdAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(t.createdAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <a
                    href={`https://nirmayaa.vercel.app/room/${t._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
                      <Activity className="w-4 h-4 mr-2" />
                      Join Session
                    </Button>
                  </a>
                </div>
              </div>

              {/* Tabs for Summaries/Prescriptions */}
              <div className="p-6">
                <Tabs defaultValue="summaries" className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <TabsList className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                      <TabsTrigger value="summaries">Summaries</TabsTrigger>
                      <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                    </TabsList>
                    <button
                      onClick={() => setSideBySide((prev) => !prev)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {sideBySide ? "Single View" : "View Side by Side"}
                    </button>
                  </div>

                  {/* Single tab view */}
                  {!sideBySide && (
                    <>
                      <TabsContent value="summaries">
                        <SummariesSection
                          summaries={t.summaries || []}
                          ticketId={t._id}
                          expandedSummaries={expandedSummaries}
                          toggleSummary={toggleSummary}
                        />
                      </TabsContent>

                      <TabsContent value="prescriptions">
                        <PrescriptionsSection prescriptions={t.prescriptions || []} />
                      </TabsContent>
                    </>
                  )}

                  {/* Side-by-side view */}
                  {sideBySide && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2">Consultation Summaries</h3>
                        <SummariesSection
                          summaries={t.summaries || []}
                          ticketId={t._id}
                          expandedSummaries={expandedSummaries}
                          toggleSummary={toggleSummary}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Prescriptions</h3>
                        <PrescriptionsSection prescriptions={t.prescriptions || []} />
                      </div>
                    </div>
                  )}
                </Tabs>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
import {  AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* --- Enhanced Supporting Components --- */

const SummariesSection = ({ summaries, ticketId, expandedSummaries, toggleSummary }) => (
  <div className="space-y-4">
    {summaries.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No summaries available</p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Summaries will appear here once available</p>
      </div>
    ) : (
      <div className="grid gap-4">
        {summaries.map((s, index) => {
          const summaryKey = `${ticketId}:${s.id}`;
          const isExpanded = expandedSummaries[summaryKey];
          const hasDetailedSummary = s.aiAnalysis?.detailedSummary && s.aiAnalysis.detailedSummary.trim();
          
          return (
            <div
              key={summaryKey}
              className="group relative rounded-xl border border-slate-200/60 dark:border-slate-600/60 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/40 dark:to-slate-700/20 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/20 hover:border-slate-300/60 dark:hover:border-slate-500/60"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                      Medical Summary
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {s.aiAnalysis?.shortSummary || "No summary available"}
                  </p>
                </div>

                {/* Toggle Button */}
                {hasDetailedSummary && (
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors duration-200 flex-shrink-0"
                    onClick={() => toggleSummary(summaryKey)}
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 transition-transform duration-200" />
                    ) : (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    )}
                  </button>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && hasDetailedSummary && (
                <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-600/60 animate-in slide-in-from-top-2 duration-300">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-4 text-slate-700 dark:text-slate-200 leading-relaxed">
                      {s.aiAnalysis.detailedSummary}
                    </div>
                  </div>
                </div>
              )}

              {/* No detailed summary indicator */}
              {!hasDetailedSummary && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-600/60">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <AlertCircle className="w-3 h-3" />
                    <span>Detailed analysis not available</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const PrescriptionsSection = ({ prescriptions }) => (
  <div className="space-y-4">
    {prescriptions.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
          <Pill className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No prescriptions available</p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Your prescriptions will be displayed here</p>
      </div>
    ) : (
      <div className="grid gap-4">
        {prescriptions.map((p, index) => {
          const hasDoctor = p.prescribedBy && p.prescribedBy.trim();
          const prescriptionDate = p.date || p.createdAt;
          
          return (
            <div
              key={index}
              className="group relative rounded-xl border border-emerald-200/60 dark:border-emerald-700/60 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/20 hover:border-emerald-300/60 dark:hover:border-emerald-600/60"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">
                      Prescription #{index + 1}
                    </h4>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-800/50 dark:text-emerald-300 text-xs">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Prescription Content */}
              <div className="bg-white/60 dark:bg-emerald-900/10 rounded-lg p-4 mb-4">
                <p className="font-medium text-emerald-800 dark:text-emerald-200 leading-relaxed">
                  {p.prescription || "No prescription details available"}
                </p>
              </div>

              {/* Footer Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-600 dark:text-emerald-400">
                {hasDoctor && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Dr. {p.prescribedBy}</span>
                  </div>
                )}
                
                {prescriptionDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(prescriptionDate).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Status indicator */}
                <div className="flex items-center gap-2 ml-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Prescribed</span>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

// Keep this as the main component
export default UserDashboard;

// Also export helpers if you want to reuse them elsewhere
export { SummariesSection, PrescriptionsSection };
