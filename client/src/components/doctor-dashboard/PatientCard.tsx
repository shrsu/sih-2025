import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TicketCardProps {
  name: string;
  gender: string;
  date: string;
  onViewReport: () => void;
}

export function TicketCard({
  name,
  gender,
  date,
  onViewReport,
}: TicketCardProps) {
  return (
    <Card className="w-full min-w-sm max-w-md shadow-sm border-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          {name}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {date}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-2 text-sm text-muted-foreground space-y-2">
        <div className="flex gap-4">
          <span className="font-medium text-foreground">Gender</span>
          <span>{gender}</span>
        </div>
        <div className="pt-4 flex w-full justify-end">
          <Button onClick={onViewReport} variant="outline">
            Call Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
