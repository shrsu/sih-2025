import { useState } from "react";
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

const BASE_URL = import.meta.env.VITE_BACKEND_URI;

interface AiAnalysis {
  shortSummary: string;
  detailedSummary: string;
  transcript: string;
}

interface Summary {
  id: string;
  aiAnalysis: AiAnalysis;
  prescription?: {
    text: string;
    prescribedBy?: string;
  };
}

interface ReportSectionProps {
  ticket: {
    _id: string;
    name: string;
    gender: string;
    summaries: Summary[];
    createdAt?: string;
  };
}

function SummariesSection({ ticket }: ReportSectionProps) {
  const { entity } = useLoggedInEntity();
  const [selectedIndex, setSelectedIndex] = useState(
    ticket.summaries.length - 1
  );
  const selectedSummary = ticket.summaries[selectedIndex];

  const [prescriptionText, setPrescriptionText] = useState(
    selectedSummary?.prescription?.text || ""
  );

  const [updating, setUpdating] = useState(false);

  const handleSummaryChange = (val: string) => {
    const idx = Number(val);
    setSelectedIndex(idx);
    setPrescriptionText(ticket.summaries[idx].prescription?.text || "");
  };

  const handleUpdate = async () => {
    if (!entity?.name || !prescriptionText.trim()) {
      alert("Doctor name and prescription are required.");
      return;
    }

    setUpdating(true);

    try {
      await axios.patch(`${BASE_URL}/tickets/prescription`, {
        summary_id: selectedSummary.id,
        doctor_name: entity.name,
        prescription: prescriptionText.trim(), // plain string
      });

      alert("Prescription updated successfully.");
    } catch (error) {
      console.error("Failed to update prescription:", error);
      alert("Failed to update prescription.");
    } finally {
      setUpdating(false);
    }
  };

  const formattedDate = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString()
    : new Date(
        parseInt(ticket._id.substring(0, 8), 16) * 1000
      ).toLocaleDateString();

  return (
    <div className="p-6 text-sm leading-relaxed text-muted-foreground h-full space-y-4">
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
            value={selectedIndex.toString()}
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

      {/* Prescription Editor */}
      <div className="space-y-2 pt-4">
        <p className="text-md font-medium text-foreground">Prescription</p>
        <Textarea
          placeholder="Enter prescription text..."
          value={prescriptionText}
          onChange={(e) => setPrescriptionText(e.target.value)}
          rows={6}
        />
        <Button onClick={handleUpdate} disabled={updating}>
          {updating ? "Updating..." : "Update Prescription"}
        </Button>

        {selectedSummary?.prescription?.prescribedBy && (
          <p className="text-xs mt-2 text-muted-foreground">
            Last updated by:{" "}
            <strong>{selectedSummary.prescription.prescribedBy}</strong>
          </p>
        )}
      </div>

      <hr className="border-border mt-4" />

      {/* AI Summary */}
      <div className="space-y-3">
        <div>
          <p className="text-md font-medium text-foreground mb-1">
            Short Summary:
          </p>
          <p>{selectedSummary.aiAnalysis.shortSummary}</p>
        </div>

        <div>
          <p className="text-md font-medium text-foreground mb-1">
            Detailed Summary:
          </p>
          <p>{selectedSummary.aiAnalysis.detailedSummary}</p>
        </div>

        <div>
          <p className="text-md font-medium text-foreground mb-1">
            Transcript:
          </p>
          <pre className="whitespace-pre-wrap">
            {selectedSummary.aiAnalysis.transcript}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default SummariesSection;
