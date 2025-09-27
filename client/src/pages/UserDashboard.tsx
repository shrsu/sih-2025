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
        {/* User Info Card */}
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

        {/* Main Content Card */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          {/* Section Header */}
          <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/30 border-b border-slate-200/50 dark:border-slate-700/50">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-md">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              Your Consultation History
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Active and past consultations with detailed summaries
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
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
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 inline-block mb-4">
                  <ClipboardList className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  No records found yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Your consultation history will appear here once you have sessions
                </p>
              </div>
            )}

            {/* Tickets */}
            <div className="space-y-6">
              {tickets.map((t) => (
                <div
                  key={t._id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Ticket Header */}
                  <div className="p-6 bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/30 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                          {t.name || "Unnamed Patient"} 
                          {t.gender && (
                            <span className="ml-2 text-sm font-normal bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-lg text-slate-600 dark:text-slate-300">
                              {t.gender}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <FileText className="w-4 h-4" />
                            <span className="font-mono">{t._id}</span>
                          </div>
                          {t.createdAt && (
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(t.createdAt).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            t.isActive 
                              ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              t.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                            }`} />
                            {t.isActive ? 'Active Session' : 'Completed'}
                          </div>
                        </div>
                      </div>
                      <a
                        href={`https://nirmayaa.vercel.app/room/${t._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                          <Activity className="w-4 h-4 mr-2" />
                          Join Video Session
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Ticket Content */}
                  <div className="p-6 space-y-6">
                    {/* Summaries */}
                    {t.summaries && t.summaries.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          Consultation Summaries
                        </div>
                        {t.summaries.map((s) => {
                          const summaryKey = `${t._id}:${s.id}`;
                          const isExpanded = expandedSummaries[summaryKey];
                          return (
                            <div
                              key={summaryKey}
                              className="rounded-lg border border-slate-200 dark:border-slate-600 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-700 dark:to-blue-950/20 p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    AI Analysis Summary
                                  </div>
                                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {s.aiAnalysis?.shortSummary ||
                                      "No summary available yet."}
                                  </div>
                                </div>
                                <button
                                  className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
                                  onClick={() => toggleSummary(summaryKey)}
                                >
                                  {isExpanded ? (
                                    <>
                                      Hide details
                                      <ChevronUp className="w-4 h-4" />
                                    </>
                                  ) : (
                                    <>
                                      View details
                                      <ChevronDown className="w-4 h-4" />
                                    </>
                                  )}
                                </button>
                              </div>

                              {isExpanded && (
                                <div className="mt-4 space-y-4 border-t border-slate-200/50 dark:border-slate-600/50 pt-4">
                                  {s.aiAnalysis?.detailedSummary && (
                                    <div className="bg-white/70 dark:bg-slate-800/70 rounded-lg p-4 border border-slate-200/50 dark:border-slate-600/50">
                                      <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        Detailed Analysis
                                      </div>
                                      <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {s.aiAnalysis.detailedSummary}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {s.aiAnalysis?.transcript && (
                                    <details className="bg-white/70 dark:bg-slate-800/70 rounded-lg border border-slate-200/50 dark:border-slate-600/50">
                                      <summary className="cursor-pointer select-none p-4 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors duration-200">
                                        Full Transcript
                                      </summary>
                                      <div className="px-4 pb-4">
                                        <pre className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
                                          {s.aiAnalysis.transcript}
                                        </pre>
                                      </div>
                                    </details>
                                  )}
                                  
                                  {s.prescription?.text && (
                                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                                      <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                          <Pill className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                          <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 mb-2">
                                            Prescription
                                          </div>
                                          <div className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                                            {s.prescription.text}
                                          </div>
                                          {s.prescription.prescribedBy && (
                                            <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                                              Prescribed by: {s.prescription.prescribedBy}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Additional Prescriptions */}
                    {t.prescriptions && t.prescriptions.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          Additional Prescriptions
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                          <div className="space-y-3">
                            {t.prescriptions.map((p, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 pb-3 last:pb-0 border-b border-emerald-200/50 dark:border-emerald-800/50 last:border-b-0"
                              >
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                                <div className="flex-1">
                                  <div className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                                    {p.prescription}
                                  </div>
                                  {p.prescribedBy && (
                                    <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                                      — {p.prescribedBy}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserDashboard;