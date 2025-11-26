import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface ScoreFactor {
  name: string;
  score: number;
  weight: number;
}

interface ScoreBreakdownProps {
  factors: ScoreFactor[];
}

export function ScoreBreakdown({ factors }: ScoreBreakdownProps) {
  return (
    <div className="space-y-3">
      <div className="mb-4 pb-3 border-b">
        <p className="text-xs text-muted-foreground">
          LBH (Local Business Health) Score components with weighted impact
        </p>
      </div>
      {factors.map((factor, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{factor.name}</span>
              <Badge variant="outline" className="text-xs">
                {factor.weight}%
              </Badge>
            </div>
            <span className="text-foreground">{factor.score}/100</span>
          </div>
          <Progress value={factor.score} className="h-2" />
        </div>
      ))}
    </div>
  );
}
