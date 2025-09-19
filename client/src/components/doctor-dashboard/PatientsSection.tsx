import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientCard } from "./PatientCard";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ReportSection from "./ReportSection";

type EnrichedCall = {
  _id: string;
  name: string;
  gender: "male" | "female";
  aiAnalysis: {
    shortSummary: string;
    detailedSummary: string;
    transcript: string;
  };
  createdAt?: string;
};

function PatientsSection({ calls }: { calls: EnrichedCall[] }) {
  const [selectedPatient, setSelectedPatient] = useState<EnrichedCall | null>(
    null
  );

  return (
    <div className="h-[calc(100vh-64px)] border-t">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={70} className="h-full">
          <div className="flex flex-col h-full">
            <div className="sticky top-0 z-10 bg-background px-8 py-6">
              <h1 className="text-2xl font-bold text-primary">Patients</h1>
            </div>
            <div className="flex-1 overflow-y-auto p-8 pt-6">
              <div
              className="flex gap-6"
              >
                {calls.map((call) => (
                  <PatientCard
                    key={call._id}
                    name={call.name}
                    gender={call.gender}
                    
                    date={
                      call.createdAt
                        ? new Date(call.createdAt).toLocaleDateString()
                        : new Date(
                            parseInt(call._id.substring(0, 8), 16) * 1000
                          ).toLocaleDateString()
                    }
                    onViewReport={() => setSelectedPatient(call)}
                  />
                ))}
              </div>
            </div>
          </div>
        </ResizablePanel>

        {selectedPatient && (
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
                    onClick={() => setSelectedPatient(null)}
                  >
                    <X />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ReportSection patient={selectedPatient} />
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}

export default PatientsSection;
