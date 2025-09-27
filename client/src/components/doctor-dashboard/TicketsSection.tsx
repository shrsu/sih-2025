import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketCard } from "./PatientCard";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SummariesSection from "./SummariesSection";

type Prescription = {
  _id: string;
  prescription: string;
  prescribedBy?: string;
};

type Summary = {
  id: string;
  aiAnalysis: {
    shortSummary: string;
    detailedSummary: string;
    transcript: string;
  };
};

type Ticket = {
  _id: string;
  name: string;
  gender: "male" | "female";
  phoneNumber: string;
  createdAt?: string;
  summaries: Summary[];
  prescriptions: Prescription[];
  isActive: boolean;
};

function TicketsSection({ tickets }: { tickets: Ticket[] }) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  console.log(tickets);
  return (
    <div className="h-[calc(100vh-64px)] border-t">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={70} className="h-full">
          <div className="flex flex-col h-full">
            <div className="top-0 z-10 bg-background px-8 py-6">
              <h1 className="text-2xl font-bold text-primary">Patients</h1>
            </div>
            <div className="flex-1 w-full overflow-y-auto p-8 pt-6">
              <div className="grid w-full gap-6 grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(28rem,1fr))]">
                {tickets.map((ticket) => (
                  <TicketCard
                    key={ticket._id}
                    id={ticket._id}
                    name={ticket.name}
                    gender={ticket.gender}
                    date={
                      ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString()
                        : new Date(
                            parseInt(ticket._id.substring(0, 8), 16) * 1000
                          ).toLocaleDateString()
                    }
                    onViewReport={() => setSelectedTicket(ticket)}
                  />
                ))}
              </div>
            </div>
          </div>
        </ResizablePanel>

        {selectedTicket && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} className="h-full">
              <div className="flex flex-col h-full">
                <div className="sticky top-0 z-10 bg-background px-6 py-6 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-primary">
                    Call Summary
                  </h2>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setSelectedTicket(null)}
                  >
                    <X />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <SummariesSection ticket={selectedTicket} />
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}

export default TicketsSection;
