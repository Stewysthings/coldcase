interface CaseCardProps {
  caseData: Case;
  formatDate: (date: Case['date']) => string;
}

export function CaseCard({ caseData, formatDate }: CaseCardProps) {
  return (
    <Card className="h-100 shadow-sm">
      {/* Card content */}
    </Card>
  );
}