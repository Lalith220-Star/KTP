import { Card } from "./ui/card";
import { BarChart3 } from "lucide-react";

interface BenchmarkData {
  label: string;
  yourScore: number;
  localAverage: number;
  topCompetitor: number;
}

interface CompetitiveBenchmarkChartProps {
  data: BenchmarkData[];
}

export function CompetitiveBenchmarkChart({ data }: CompetitiveBenchmarkChartProps) {
  const maxScore = 100;

  const getBarColor = (index: number) => {
    const colors = [
      { your: "#3b82f6", avg: "#93c5fd", top: "#1e40af" }, // Blue shades
      { your: "#10b981", avg: "#6ee7b7", top: "#047857" }, // Green shades
      { your: "#8b5cf6", avg: "#c4b5fd", top: "#6d28d9" }, // Purple shades
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-foreground">Competitive Benchmarking</h3>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "#3b82f6" }}></div>
          <span className="text-sm text-foreground">Your Restaurant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "#93c5fd" }}></div>
          <span className="text-sm text-muted-foreground">Local Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: "#1e40af" }}></div>
          <span className="text-sm text-muted-foreground">Top Competitor</span>
        </div>
      </div>

      {/* Bar Charts */}
      <div className="space-y-6">
        {data.map((item, index) => {
          const colors = getBarColor(index);
          const isAboveAverage = item.yourScore > item.localAverage;
          const isAboveTop = item.yourScore > item.topCompetitor;

          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm text-foreground">{item.label}</h4>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>You: <strong className="text-foreground">{item.yourScore}</strong></span>
                  <span>Avg: {item.localAverage}</span>
                  <span>Top: {item.topCompetitor}</span>
                </div>
              </div>
              
              <div className="relative h-12 mb-1">
                {/* Grid lines */}
                <div className="absolute inset-0 flex">
                  {[0, 25, 50, 75, 100].map((value) => (
                    <div
                      key={value}
                      className="flex-1 border-l border-gray-200 dark:border-gray-700"
                      style={{ position: 'absolute', left: `${value}%`, height: '100%' }}
                    />
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex flex-col justify-around py-1">
                  {/* Your Restaurant Bar */}
                  <div className="relative h-3">
                    <div
                      className="absolute left-0 h-full rounded transition-all duration-500 flex items-center justify-end pr-2"
                      style={{
                        width: `${(item.yourScore / maxScore) * 100}%`,
                        backgroundColor: colors.your
                      }}
                    >
                      {item.yourScore >= 15 && (
                        <span className="text-xs text-white font-semibold">{item.yourScore}</span>
                      )}
                    </div>
                  </div>

                  {/* Local Average Bar */}
                  <div className="relative h-3">
                    <div
                      className="absolute left-0 h-full rounded transition-all duration-500 flex items-center justify-end pr-2"
                      style={{
                        width: `${(item.localAverage / maxScore) * 100}%`,
                        backgroundColor: colors.avg
                      }}
                    >
                      {item.localAverage >= 15 && (
                        <span className="text-xs text-gray-700 dark:text-gray-900 font-semibold">{item.localAverage}</span>
                      )}
                    </div>
                  </div>

                  {/* Top Competitor Bar */}
                  <div className="relative h-3">
                    <div
                      className="absolute left-0 h-full rounded transition-all duration-500 flex items-center justify-end pr-2"
                      style={{
                        width: `${(item.topCompetitor / maxScore) * 100}%`,
                        backgroundColor: colors.top
                      }}
                    >
                      {item.topCompetitor >= 15 && (
                        <span className="text-xs text-white font-semibold">{item.topCompetitor}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis */}
              {!isAboveAverage && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  ⚠️ Below local average by {item.localAverage - item.yourScore} points
                </p>
              )}
              {isAboveAverage && !isAboveTop && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  ✓ Above average, {item.topCompetitor - item.yourScore} points behind top competitor
                </p>
              )}
              {isAboveTop && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ★ Leading in this category!
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between mt-4 pt-2 border-t border-border text-xs text-muted-foreground">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </Card>
  );
}
