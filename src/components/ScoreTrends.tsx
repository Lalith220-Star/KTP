import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Calendar, Activity } from "lucide-react";
import { Restaurant } from "../types/restaurant";

interface ScoreTrendsProps {
  userBusiness: Restaurant;
}

export function ScoreTrends({ userBusiness }: ScoreTrendsProps) {
  // Generate simulated historical data for the last 6 months
  const generateHistoricalData = () => {
    const months = ["Oct 2024", "Nov 2024", "Dec 2024", "Jan 2025", "Feb 2025", "Mar 2025"];
    const currentScore = userBusiness.overallScore;
    
    // Simulate a trend - slight decline then recovery
    const historicalScores = [
      currentScore + 5,  // Oct (better)
      currentScore + 3,  // Nov
      currentScore - 2,  // Dec (dip)
      currentScore - 4,  // Jan (lowest)
      currentScore - 1,  // Feb (recovery)
      currentScore       // Mar (current)
    ];

    return months.map((month, index) => ({
      month,
      score: historicalScores[index],
      change: index > 0 ? historicalScores[index] - historicalScores[index - 1] : 0
    }));
  };

  const generateFactorTrends = () => {
    return userBusiness.factors.map(factor => {
      // Simulate trend for each factor
      const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
      const previousScore = factor.score - change;
      
      return {
        ...factor,
        previousScore,
        change,
        trend: change > 0 ? "improving" : change < 0 ? "declining" : "stable"
      };
    });
  };

  const historicalData = generateHistoricalData();
  const factorTrends = generateFactorTrends();
  const latestChange = historicalData[historicalData.length - 1].change;
  const sixMonthChange = historicalData[historicalData.length - 1].score - historicalData[0].score;

  // Calculate max/min for chart scaling
  const scores = historicalData.map(d => d.score);
  const minScore = Math.min(...scores) - 5;
  const maxScore = Math.max(...scores) + 5;
  const scoreRange = maxScore - minScore;

  const getPositionY = (score: number) => {
    return ((maxScore - score) / scoreRange) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Trend Summary */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-foreground mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              LBH Score Trends
            </h3>
            <p className="text-sm text-muted-foreground">
              6-month performance tracking
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">30-Day Change</div>
            <div className={`flex items-center gap-1 text-xl ${
              latestChange > 0 ? "text-green-600 dark:text-green-400" : 
              latestChange < 0 ? "text-red-600 dark:text-red-400" : 
              "text-muted-foreground"
            }`}>
              {latestChange > 0 ? (
                <>
                  <TrendingUp className="w-5 h-5" />
                  +{latestChange}
                </>
              ) : latestChange < 0 ? (
                <>
                  <TrendingDown className="w-5 h-5" />
                  {latestChange}
                </>
              ) : (
                <>0</>
              )}
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="relative h-48 bg-muted rounded-lg p-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-muted-foreground">
            <span>{maxScore}</span>
            <span>{Math.round((maxScore + minScore) / 2)}</span>
            <span>{minScore}</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="border-t border-border/30" />
              ))}
            </div>

            {/* Line path */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <polyline
                points={historicalData.map((d, i) => {
                  const x = (i / (historicalData.length - 1)) * 100;
                  const y = getPositionY(d.score);
                  return `${x}%,${y}%`;
                }).join(" ")}
                fill="none"
                stroke="rgb(37, 99, 235)"
                strokeWidth="2"
                className="dark:stroke-blue-400"
              />
              
              {/* Data points */}
              {historicalData.map((d, i) => {
                const x = (i / (historicalData.length - 1)) * 100;
                const y = getPositionY(d.score);
                return (
                  <g key={i}>
                    <circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="4"
                      fill="rgb(37, 99, 235)"
                      className="dark:fill-blue-400"
                    />
                    <title>{`${d.month}: ${d.score}`}</title>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="ml-12 mt-2 flex justify-between text-xs text-muted-foreground">
            {historicalData.map((d, i) => (
              i % 2 === 0 && <span key={i}>{d.month.split(" ")[0]}</span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center p-3 bg-background rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Current</div>
            <div className="text-2xl text-foreground">{userBusiness.overallScore}</div>
          </div>
          <div className="text-center p-3 bg-background rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">6-Month Change</div>
            <div className={`text-2xl ${
              sixMonthChange > 0 ? "text-green-600 dark:text-green-400" : 
              sixMonthChange < 0 ? "text-red-600 dark:text-red-400" : 
              "text-muted-foreground"
            }`}>
              {sixMonthChange > 0 ? `+${sixMonthChange}` : sixMonthChange}
            </div>
          </div>
          <div className="text-center p-3 bg-background rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Peak Score</div>
            <div className="text-2xl text-foreground">{Math.max(...scores)}</div>
          </div>
        </div>
      </Card>

      {/* Component Trends */}
      <Card className="p-6">
        <h3 className="text-foreground mb-4">Component Score Trends (30 Days)</h3>
        <div className="space-y-4">
          {factorTrends.map((factor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-foreground">{factor.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {factor.weight}% weight
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">
                    {factor.previousScore} → {factor.score}
                  </span>
                  {factor.trend !== "stable" && (
                    <span className={`flex items-center gap-1 ${
                      factor.trend === "improving" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}>
                      {factor.trend === "improving" ? (
                        <>
                          <TrendingUp className="w-3 h-3" />
                          +{factor.change}
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3" />
                          {factor.change}
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl text-foreground">{factor.score}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <h4 className="text-foreground mb-3">Trend Analysis</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {sixMonthChange < -5 && (
            <li className="text-red-600 dark:text-red-400">
              ⚠️ Your LBH Score has declined {Math.abs(sixMonthChange)} points over 6 months. Review the root cause analysis for immediate action items.
            </li>
          )}
          {sixMonthChange > 5 && (
            <li className="text-green-600 dark:text-green-400">
              ✓ Excellent progress! Your LBH Score has improved {sixMonthChange} points over 6 months. Continue current operational practices.
            </li>
          )}
          {factorTrends.filter(f => f.trend === "declining").length > 2 && (
            <li className="text-orange-600 dark:text-orange-400">
              • Multiple components showing decline. Consider conducting staff review and operational audit.
            </li>
          )}
          <li className="text-foreground">
            • Track these trends weekly to identify patterns and measure the impact of operational changes.
          </li>
        </ul>
      </Card>
    </div>
  );
}
