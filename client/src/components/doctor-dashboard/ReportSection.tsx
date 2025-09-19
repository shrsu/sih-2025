interface ReportSectionProps {
  patient: {
    _id: string;
    name: string;
    gender: string;
    aiAnalysis: {
      shortSummary: string;
      detailedSummary: string;
      transcript: string;
    };
    createdAt?: string;
  };
}

function ReportSection({ patient }: ReportSectionProps) {
  const formattedDate = patient.createdAt
    ? new Date(patient.createdAt).toLocaleDateString()
    : new Date(
        parseInt(patient._id.substring(0, 8), 16) * 1000
      ).toLocaleDateString();

  return (
    <div className="p-6 text-sm leading-relaxed text-muted-foreground h-full space-y-4">
      <div className="space-y-1">
        <p className="text-lg font-semibold text-foreground">{patient.name}</p>
        <div className="flex gap-4 text-muted-foreground text-sm">
          <span>Gender: {patient.gender}</span>
          <span>Date: {formattedDate}</span>
        </div>
      </div>
      <hr className="border-border" />
      <div className="space-y-3">
        <div>
          <p className="text-md font-medium text-foreground mb-1">
            Short Summary:
          </p>
          <p>{patient.aiAnalysis.shortSummary}</p>
        </div>
        <div>
          <p className="text-md font-medium text-foreground mb-1">
            Detailed Summary:
          </p>
          <p>{patient.aiAnalysis.detailedSummary}</p>
        </div>
        <div>
          <p className="text-md font-medium text-foreground mb-1">
            Transcript:
          </p>
          <pre className="whitespace-pre-wrap">
            {patient.aiAnalysis.transcript}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ReportSection;
