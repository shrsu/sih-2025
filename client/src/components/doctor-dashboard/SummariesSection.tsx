import { useState, useEffect } from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoggedInEntity } from "@/contexts/LoggedInEntityContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BASE_URL = import.meta.env.VITE_BACKEND_URI;

interface AiAnalysis {
  shortSummary: string;
  detailedSummary: string;
  transcript: string;
}

interface Summary {
  id: string;
  aiAnalysis: AiAnalysis;
}

interface Prescription {
  prescription: string;
  prescribedBy?: string;
}

interface ReportSectionProps {
  ticket: {
    _id: string;
    name: string;
    gender: string;
    summaries: Summary[];
    prescriptions: Prescription[];
    createdAt?: string;
  };
}

function SummariesSection({ ticket }: ReportSectionProps) {
  const { entity } = useLoggedInEntity();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedSummaryIndex, setSelectedSummaryIndex] = useState(0);
  const [newPrescriptionText, setNewPrescriptionText] = useState("");
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const selectedSummary = ticket.summaries[selectedSummaryIndex];

  useEffect(() => {
    setPrescriptions(ticket.prescriptions || []);
    setSelectedSummaryIndex(ticket.summaries.length - 1);
    setNewPrescriptionText("");
    setStatus("idle");
  }, [ticket]);

  const handleSummaryChange = (val: string) => {
    const idx = Number(val);
    setSelectedSummaryIndex(idx);
  };

  const handleAddPrescription = async () => {
    if (!entity?.name || !newPrescriptionText.trim()) return;

    setUpdating(true);
    setStatus("idle");

    try {
      await axios.patch(`${BASE_URL}/tickets/prescription`, {
        ticketId: ticket._id,
        doctor_name: entity.name,
        prescription: newPrescriptionText.trim(),
      });

      const newPrescription: Prescription = {
        prescription: newPrescriptionText.trim(),
        prescribedBy: entity.name,
      };

      setPrescriptions((prev) => [...prev, newPrescription]);
      setNewPrescriptionText("");
      setStatus("success");
    } catch (err) {
      console.error("Failed to append prescription:", err);
      setStatus("error");
    } finally {
      setUpdating(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const formattedDate = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString()
    : new Date(
        parseInt(ticket._id.substring(0, 8), 16) * 1000
      ).toLocaleDateString();

  return (
    <div className="p-6 text-sm leading-relaxed text-muted-foreground h-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-lg font-semibold text-foreground">{ticket.name}</p>
        <div className="flex gap-4 text-muted-foreground text-sm">
          <span>Gender: {ticket.gender}</span>
          <span>Date: {formattedDate}</span>
        </div>
        <p className="text-xs text-muted-foreground break-all">
          Ticket ID: <span className="font-mono">{ticket._id}</span>
        </p>
      </div>

      {/* Summary Selector */}
      {ticket.summaries.length > 1 && (
        <div className="w-40">
          <Select
            value={selectedSummaryIndex.toString()}
            onValueChange={handleSummaryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select summary" />
            </SelectTrigger>
            <SelectContent>
              {ticket.summaries.map((_, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  Call {idx + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* AI Summary */}
      <div className="space-y-3">
        <div>
          <p className="text-md font-medium text-foreground mb-1">
            Short Summary:
          </p>
          <p>{selectedSummary?.aiAnalysis?.shortSummary}</p>
        </div>

        <div>
          <p className="text-md font-medium text-foreground mb-1">
            Detailed Summary:
          </p>
          <p>{selectedSummary?.aiAnalysis?.detailedSummary}</p>
        </div>

        <div>
          <p className="text-md font-medium text-foreground mb-1">
            Transcript:
          </p>
          <pre className="whitespace-pre-wrap">
            {selectedSummary?.aiAnalysis?.transcript}
          </pre>
        </div>
      </div>

      <hr className="border-border mt-4" />

      {/* ---- 🧾 Existing Prescriptions in Accordion ---- */}
      <div className="space-y-2">
        <p className="text-md font-medium text-foreground">Prescriptions</p>

        {prescriptions.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {prescriptions.map((prescription, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger>Prescription {idx + 1}</AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    value={prescription.prescription}
                    readOnly
                    rows={4}
                    className="bg-muted mb-2"
                  />
                  {prescription.prescribedBy && (
                    <p className="text-xs text-muted-foreground">
                      Prescribed by:{" "}
                      <strong>{prescription.prescribedBy}</strong>
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground text-xs italic">
            No prescriptions added yet.
          </p>
        )}
      </div>

      {/* ---- ➕ Add New Prescription ---- */}
      <div className="space-y-2 pt-4">
        <p className="text-md font-medium text-foreground">Add Prescription</p>
        <Textarea
          placeholder="Enter prescription text..."
          value={newPrescriptionText}
          onChange={(e) => setNewPrescriptionText(e.target.value)}
          rows={6}
        />
        <Button
          onClick={handleAddPrescription}
          disabled={updating || !newPrescriptionText.trim()}
        >
          {updating
            ? "Adding..."
            : status === "success"
            ? "Added ✓"
            : status === "error"
            ? "Error ✕"
            : "Add Prescription"}
        </Button>
      </div>
    </div>
  );
}

export default SummariesSection;
