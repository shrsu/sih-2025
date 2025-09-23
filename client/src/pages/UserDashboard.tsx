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
    <main className="min-h-screen bg-background dark:bg-gray-900 flex flex-col">
      <header className="flex w-full justify-between items-center px-6 py-4 sticky top-0 z-10 bg-card border-b shadow-sm">
        <div className="flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Your Health Records
            </h1>
            <p className="text-sm text-muted-foreground">
              View your consultation summaries and prescriptions
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size={"icon"} onClick={handleLogout}>
            <LogOut />
          </Button>
          <ModeToggle />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-6 w-full">
        <div className="bg-card rounded-xl shadow-sm p-6 mb-6 border dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-foreground">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{entity?.id || "Unknown"}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Keep this number safe. It's used to locate your records.
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border dark:border-gray-700">
          <div className="p-6 border-b dark:border-gray-800">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-foreground">
              <ClipboardList className="h-5 w-5" /> Your Tickets
            </h2>
            <p className="text-sm text-muted-foreground">
              Active and past consultations
            </p>
          </div>

          <div className="p-6">
            {loading && (
              <div className="text-sm text-muted-foreground">
                Loading your records...
              </div>
            )}
            {error && <div className="text-sm text-red-600">{error}</div>}
            {!loading && !error && tickets.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No records found yet.
              </div>
            )}

            <div className="space-y-5">
              {tickets.map((t) => (
                <div
                  key={t._id}
                  className="rounded-lg border p-4 bg-background"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-base font-medium text-foreground">
                        {t.name || "Unnamed"} {t.gender ? `• ${t.gender}` : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ticket ID: {t._id}
                        {t.createdAt
                          ? ` • Created ${new Date(
                              t.createdAt
                            ).toLocaleString()}`
                          : ""}
                      </div>
                      <div className="text-xs">
                        Status:{" "}
                        {t.isActive ? (
                          <span className="text-emerald-600 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summaries */}
                  {t.summaries && t.summaries.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <div className="text-sm font-medium text-foreground">
                        Consultation Summaries
                      </div>
                      {t.summaries.map((s) => {
                        const summaryKey = `${t._id}:${s.id}`;
                        return (
                          <div
                            key={summaryKey}
                            className="rounded-md border p-3 bg-card/50"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-foreground">
                                  Summary
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {s.aiAnalysis?.shortSummary ||
                                    "No short summary available."}
                                </div>
                              </div>
                              <button
                                className="text-xs text-primary flex items-center gap-1"
                                onClick={() => toggleSummary(summaryKey)}
                              >
                                {expandedSummaries[summaryKey] ? (
                                  <>
                                    Hide details{" "}
                                    <ChevronUp className="w-4 h-4" />
                                  </>
                                ) : (
                                  <>
                                    View details{" "}
                                    <ChevronDown className="w-4 h-4" />
                                  </>
                                )}
                              </button>
                            </div>

                            {expandedSummaries[summaryKey] && (
                              <div className="mt-3 space-y-2">
                                {!!s.aiAnalysis?.detailedSummary && (
                                  <div className="text-sm text-foreground">
                                    <span className="font-medium">
                                      Detailed:
                                    </span>{" "}
                                    {s.aiAnalysis.detailedSummary}
                                  </div>
                                )}
                                {!!s.aiAnalysis?.transcript && (
                                  <details className="text-sm">
                                    <summary className="cursor-pointer select-none text-foreground">
                                      Transcript
                                    </summary>
                                    <pre className="mt-2 whitespace-pre-wrap text-muted-foreground bg-background p-2 rounded border">
                                      {s.aiAnalysis.transcript}
                                    </pre>
                                  </details>
                                )}
                                {s.prescription?.text && (
                                  <div className="text-sm text-foreground flex items-start gap-2">
                                    <Pill className="w-4 h-4 text-emerald-600 mt-0.5" />
                                    <div>
                                      <div className="font-medium">
                                        Prescription
                                      </div>
                                      <div className="text-muted-foreground">
                                        {s.prescription.text}
                                      </div>
                                      {s.prescription.prescribedBy && (
                                        <div className="text-xs text-muted-foreground">
                                          Prescribed by:{" "}
                                          {s.prescription.prescribedBy}
                                        </div>
                                      )}
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

                  {t.prescriptions && t.prescriptions.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-sm font-medium text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Prescriptions
                      </div>
                      <ul className="list-disc ml-6 text-sm text-foreground">
                        {t.prescriptions.map((p, idx) => (
                          <li key={idx} className="mb-1">
                            <span className="text-muted-foreground">
                              {p.prescription}
                            </span>
                            {p.prescribedBy && (
                              <span className="text-xs text-muted-foreground">
                                {" "}
                                — {p.prescribedBy}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
