import { Card } from "./ui/card";
import { Award, TrendingUp, TrendingDown } from "lucide-react";

interface LBHScoreGaugeProps {
  score: number;
  comparisonText?: string;
  comparisonTrend?: "up" | "down" | "neutral";
  showBreakdown?: boolean;
  customerSentiment?: number;
  operationalConsistency?: number;
  talentStability?: number;
}

export function LBHScoreGauge({ 
  score, 
  comparisonText,
  comparisonTrend,
  showBreakdown = false,
  customerSentiment = 0,
  operationalConsistency = 0,
  talentStability = 0
}: LBHScoreGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: "#22c55e", label: "Excellent", bg: "bg-green-50 dark:bg-green-950" };
    if (score >= 60) return { color: "#eab308", label: "Good", bg: "bg-yellow-50 dark:bg-yellow-950" };
    return { color: "#ef4444", label: "Needs Improvement", bg: "bg-red-50 dark:bg-red-950" };
  };

  const scoreInfo = getScoreColor(score);
  
  // Calculate angles for the semi-circle (180 degrees total)
  const scoreAngle = (score / 100) * 180;
  
  // Helper function to convert polar coordinates to cartesian
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Create arc path
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const centerX = 140;
  const centerY = 140;
  const radius = 100;

  return (
    <Card className={`p-6 ${scoreInfo.bg} border-2`}>
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-6 h-6" style={{ color: scoreInfo.color }} />
        <h3 className="text-foreground">Local Business Health Score</h3>
      </div>
      
      {/* Semi-Circle Gauge */}
      <div className="relative mx-auto mb-6" style={{ width: '280px', height: '160px' }}>
        <svg viewBox="0 0 280 160" className="w-full h-full">
          {/* Background Arc - Red Zone (0-59) */}
          <path
            d={describeArc(centerX, centerY, radius, 0, 59 * 1.8)}
            fill="none"
            stroke="#ef4444"
            strokeWidth="28"
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* Background Arc - Yellow Zone (60-79) */}
          <path
            d={describeArc(centerX, centerY, radius, 60 * 1.8, 79 * 1.8)}
            fill="none"
            stroke="#eab308"
            strokeWidth="28"
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* Background Arc - Green Zone (80-100) */}
          <path
            d={describeArc(centerX, centerY, radius, 80 * 1.8, 180)}
            fill="none"
            stroke="#22c55e"
            strokeWidth="28"
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* Active Arc - Shows current score */}
          <path
            d={describeArc(centerX, centerY, radius, 0, scoreAngle)}
            fill="none"
            stroke={scoreInfo.color}
            strokeWidth="28"
            strokeLinecap="round"
          />
          
          {/* Center Score */}
          <text
            x={centerX}
            y="110"
            textAnchor="middle"
            className="fill-foreground"
            style={{ fontSize: '48px', fontWeight: 'bold' }}
          >
            {score}
          </text>
          <text
            x={centerX}
            y="130"
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: '14px' }}
          >
            out of 100
          </text>
        </svg>
        
        {/* Score Labels */}
        <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">0</div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">50</div>
        <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">100</div>
      </div>

      {/* Status Badge */}
      <div className="text-center mb-4">
        <div 
          className="inline-flex items-center px-3 py-1 rounded-full text-sm"
          style={{ 
            backgroundColor: scoreInfo.color + '20',
            color: scoreInfo.color,
            fontWeight: '600'
          }}
        >
          {scoreInfo.label}
        </div>
      </div>

      {/* Comparison */}
      {comparisonText && (
        <div className={`flex items-center justify-center gap-2 text-sm ${
          comparisonTrend === "up" ? "text-green-600 dark:text-green-400" : 
          comparisonTrend === "down" ? "text-red-600 dark:text-red-400" : 
          "text-muted-foreground"
        }`}>
          {comparisonTrend === "up" && <TrendingUp className="w-4 h-4" />}
          {comparisonTrend === "down" && <TrendingDown className="w-4 h-4" />}
          <span>{comparisonText}</span>
        </div>
      )}

      {/* Color Key */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2">Score Range:</div>
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-muted-foreground">0-59</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-muted-foreground">60-79</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-muted-foreground">80-100</span>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      {showBreakdown && (
        <div className="mt-6 pt-4 border-t border-border space-y-3">
          <div className="text-sm text-muted-foreground mb-2">Score Components:</div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-foreground">Customer Sentiment</span>
              <span className="text-muted-foreground">{customerSentiment}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${customerSentiment}%`,
                  backgroundColor: getScoreColor(customerSentiment).color
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-foreground">Operational Consistency</span>
              <span className="text-muted-foreground">{operationalConsistency}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${operationalConsistency}%`,
                  backgroundColor: getScoreColor(operationalConsistency).color
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-foreground">Talent Stability</span>
              <span className="text-muted-foreground">{talentStability}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500"
                style={{ 
                  width: `${talentStability}%`,
                  backgroundColor: getScoreColor(talentStability).color
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}