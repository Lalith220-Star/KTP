import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { 
  AlertTriangle, TrendingDown, CheckCircle, Clock, 
  Users, MessageSquare, Calendar, Target, Zap
} from "lucide-react";
import { Restaurant } from "../types/restaurant";

interface OperationalInsightsProps {
  userBusiness: Restaurant;
  allRestaurants: Restaurant[];
}

interface DataSignal {
  source: string;
  metric: string;
  value: string;
  trend: "up" | "down" | "stable";
  impact: "high" | "medium" | "low";
  icon: any;
}

interface ActionableInsight {
  priority: "critical" | "high" | "medium";
  category: string;
  issue: string;
  rootCause: string;
  recommendation: string;
  estimatedImpact: string;
  timeframe: string;
}

export function OperationalInsights({ userBusiness, allRestaurants }: OperationalInsightsProps) {
  // Simulated data signals from public sources
  const dataSignals: DataSignal[] = [
    {
      source: "Google Reviews (Last 30 days)",
      metric: "Review Volume",
      value: "12 reviews",
      trend: "down",
      impact: "medium",
      icon: MessageSquare
    },
    {
      source: "Job Posting Analysis",
      metric: "Staff Turnover Signal",
      value: "3 postings",
      trend: "up",
      impact: "high",
      icon: Users
    },
    {
      source: "Hours Monitoring",
      metric: "Schedule Changes",
      value: "2 changes",
      trend: "up",
      impact: "low",
      icon: Calendar
    },
    {
      source: "Response Time Analysis",
      metric: "Avg. Owner Response",
      value: "2.3 days",
      trend: "stable",
      impact: "medium",
      icon: Clock
    }
  ];

  // Generate actionable insights based on component scores
  const generateInsights = (): ActionableInsight[] => {
    const insights: ActionableInsight[] = [];
    const sameTypeRestaurants = allRestaurants.filter(
      r => r.cuisine === userBusiness.cuisine && r.id !== userBusiness.id
    );

    userBusiness.factors.forEach((factor) => {
      const avgScore = sameTypeRestaurants.length > 0
        ? Math.round(
            sameTypeRestaurants.reduce((sum, r) => {
              const f = r.factors.find(rf => rf.name === factor.name);
              return sum + (f?.score || 0);
            }, 0) / sameTypeRestaurants.length
          )
        : 0;

      const diff = factor.score - avgScore;

      // Generate insights for underperforming areas
      if (diff < -5 && factor.score < 75) {
        let insight: ActionableInsight | null = null;

        switch (factor.name) {
          case "Food Quality":
            insight = {
              priority: "critical",
              category: "Food Quality",
              issue: `Food Quality score (${factor.score}) is ${Math.abs(diff)} points below local ${userBusiness.cuisine} average (${avgScore})`,
              rootCause: "Recent reviews mention inconsistent seasoning and portion sizes. Possible kitchen staff changes detected (3 new job postings in last 60 days).",
              recommendation: "Conduct immediate kitchen staff training session on portion control and recipe standardization. Implement daily taste tests before service.",
              estimatedImpact: "+8-12 points in 30-45 days",
              timeframe: "Implement within 7 days"
            };
            break;

          case "Service":
            insight = {
              priority: "high",
              category: "Service Quality",
              issue: `Service score (${factor.score}) is ${Math.abs(diff)} points below industry standard (${avgScore})`,
              rootCause: "High staff turnover detected (3 server positions posted in last 90 days). Reviews mention slow service during peak hours and new/untrained staff.",
              recommendation: "Implement structured onboarding program for new servers. Cross-train existing staff. Consider adjusting staffing levels during 6-8pm rush.",
              estimatedImpact: "+6-10 points in 45-60 days",
              timeframe: "Start immediately"
            };
            break;

          case "Cleanliness":
            insight = {
              priority: "critical",
              category: "Cleanliness & Hygiene",
              issue: `Cleanliness score (${factor.score}) significantly below competitor average (${avgScore})`,
              rootCause: "Multiple reviews mention dirty restrooms and sticky tables. Possible understaffing during closing shifts.",
              recommendation: "Implement hourly restroom checks with sign-off sheet. Add dedicated busser during peak hours. Deep clean all high-touch surfaces.",
              estimatedImpact: "+10-15 points in 14-21 days",
              timeframe: "Critical - address within 48 hours"
            };
            break;

          case "Value for Money":
            insight = {
              priority: "medium",
              category: "Value Perception",
              issue: `Value score (${factor.score}) trails competitors (${avgScore})`,
              rootCause: "Pricing appears 15% higher than nearby ${userBusiness.cuisine} restaurants with similar offerings. Recent price increases not matched by portion adjustments.",
              recommendation: "Consider adding a value menu or lunch specials. Alternatively, increase portion sizes or add complimentary items (bread, salad) to justify pricing.",
              estimatedImpact: "+5-8 points in 30 days",
              timeframe: "Implement within 14 days"
            };
            break;

          case "Ambiance":
            insight = {
              priority: "medium",
              category: "Customer Experience",
              issue: `Ambiance score (${factor.score}) below area standards (${avgScore})`,
              rootCause: "Reviews mention outdated decor, uncomfortable seating, and poor lighting. Last renovation was likely 5+ years ago.",
              recommendation: "Quick wins: Update lighting to warmer tones, add plants/greenery, refresh paint. Longer term: Consider seating upgrades and music selection.",
              estimatedImpact: "+4-7 points in 60-90 days",
              timeframe: "Phase 1 within 30 days"
            };
            break;
        }

        if (insight) insights.push(insight);
      }
    });

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2 };
    return insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };

  const insights = generateInsights();
  const criticalCount = insights.filter(i => i.priority === "critical").length;
  const highCount = insights.filter(i => i.priority === "high").length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100";
      case "high": return "bg-orange-100 dark:bg-orange-950 border-orange-300 dark:border-orange-800 text-orange-900 dark:text-orange-100";
      case "medium": return "bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100";
      default: return "";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-600 text-white hover:bg-red-700";
      case "high": return "bg-orange-600 text-white hover:bg-orange-700";
      case "medium": return "bg-yellow-600 text-white hover:bg-yellow-700";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      {insights.length > 0 && (
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-foreground">
            <strong>{insights.length} actionable insights</strong> identified from public data analysis
            {criticalCount > 0 && <span className="text-red-600 dark:text-red-400"> ({criticalCount} critical)</span>}
            {highCount > 0 && <span className="text-orange-600 dark:text-orange-400"> ({highCount} high priority)</span>}
          </AlertDescription>
        </Alert>
      )}

      {/* Data Source Signals */}
      <Card className="p-6">
        <h3 className="text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Public Data Signals (Last 30 Days)
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Real-time monitoring of operational indicators from public sources
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dataSignals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-foreground">{signal.metric}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      signal.impact === "high" ? "border-red-500 text-red-700 dark:text-red-400" :
                      signal.impact === "medium" ? "border-orange-500 text-orange-700 dark:text-orange-400" :
                      "border-gray-500 text-gray-700 dark:text-gray-400"
                    }
                  >
                    {signal.impact} impact
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg text-foreground">{signal.value}</span>
                  <span className="text-xs text-muted-foreground">{signal.source}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Actionable Insights */}
      <Card className="p-6">
        <h3 className="text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          Root Cause Analysis & Recommendations
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Diagnostic insights based on competitive benchmarking and public data analysis
        </p>

        {insights.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
            <h4 className="text-foreground mb-2">All Systems Performing Well</h4>
            <p className="text-sm text-muted-foreground">
              Your operational metrics are meeting or exceeding industry standards. Continue monitoring for any changes.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Card key={index} className={`p-5 border-2 ${getPriorityColor(insight.priority)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityBadgeColor(insight.priority)}>
                      {insight.priority.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium">{insight.category}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {insight.timeframe}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Issue Identified</div>
                    <p className="text-sm text-foreground">{insight.issue}</p>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Root Cause</div>
                    <p className="text-sm text-foreground">{insight.rootCause}</p>
                  </div>

                  <div className="p-3 bg-background rounded-lg border">
                    <div className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Recommended Action
                    </div>
                    <p className="text-sm text-foreground mb-2">{insight.recommendation}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Expected Impact:</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">{insight.estimatedImpact}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Implementation Priority */}
      {insights.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <h4 className="text-foreground mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Recommended Implementation Order
          </h4>
          <ol className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="text-sm text-foreground flex items-start gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <span>
                  <strong>{insight.category}</strong> - {insight.timeframe}
                  <span className="text-green-600 dark:text-green-400 ml-2">
                    (Potential: {insight.estimatedImpact})
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      )}
    </div>
  );
}
