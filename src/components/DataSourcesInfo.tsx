import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Database, MessageSquare, Briefcase, Clock, 
  MapPin, Phone, Globe, TrendingUp 
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function DataSourcesInfo() {
  const dataSources = [
    {
      icon: MessageSquare,
      name: "Customer Reviews",
      description: "Google Reviews, Yelp, TripAdvisor",
      dataPoints: ["Review volume", "Rating trends", "Sentiment analysis", "Response times"],
      updateFrequency: "Daily",
      impact: "High"
    },
    {
      icon: Briefcase,
      name: "Employment Signals",
      description: "Job postings on Indeed, LinkedIn, Glassdoor",
      dataPoints: ["Staff turnover rate", "Position vacancy duration", "Hiring patterns"],
      updateFrequency: "Weekly",
      impact: "High"
    },
    {
      icon: Clock,
      name: "Operating Hours",
      description: "Google Business Profile, Yelp",
      dataPoints: ["Schedule changes", "Closure patterns", "Peak hour analysis"],
      updateFrequency: "Daily",
      impact: "Medium"
    },
    {
      icon: MapPin,
      name: "Location Data",
      description: "Google Maps, Census data",
      dataPoints: ["Foot traffic estimates", "Competitor proximity", "Demographics"],
      updateFrequency: "Monthly",
      impact: "Medium"
    },
    {
      icon: Globe,
      name: "Online Presence",
      description: "Website, social media platforms",
      dataPoints: ["Update frequency", "Engagement metrics", "Menu changes"],
      updateFrequency: "Daily",
      impact: "Low"
    },
    {
      icon: Phone,
      name: "Customer Service",
      description: "Review mentions, complaint patterns",
      dataPoints: ["Response quality", "Issue resolution", "Wait times"],
      updateFrequency: "Daily",
      impact: "Medium"
    }
  ];

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-foreground mb-2 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Data Sources & Methodology
        </h3>
        <p className="text-sm text-muted-foreground">
          Localytics aggregates public data from multiple sources to generate your LBH Score
        </p>
      </div>

      <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-sm text-foreground">
          All data is collected from publicly available sources. No private or customer PII is accessed.
          Our machine learning algorithms analyze patterns and trends to provide actionable insights.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataSources.map((source, index) => {
          const Icon = source.icon;
          return (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-foreground">{source.name}</h4>
                    <Badge 
                      variant="outline"
                      className={
                        source.impact === "High" ? "border-red-500 text-red-700 dark:text-red-400" :
                        source.impact === "Medium" ? "border-orange-500 text-orange-700 dark:text-orange-400" :
                        "border-gray-500 text-gray-700 dark:text-gray-400"
                      }
                    >
                      {source.impact}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{source.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Updates: {source.updateFrequency}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                {source.dataPoints.map((point, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-background rounded-lg border">
        <h4 className="text-sm text-foreground mb-3">How Your LBH Score is Calculated</h4>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-medium">1.</span>
            <span><strong className="text-foreground">Data Collection:</strong> Public data is gathered from all listed sources in real-time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-medium">2.</span>
            <span><strong className="text-foreground">Pattern Analysis:</strong> ML algorithms identify trends, anomalies, and correlations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-medium">3.</span>
            <span><strong className="text-foreground">Component Scoring:</strong> Each of 6 factors is scored 0-100 based on weighted metrics</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-medium">4.</span>
            <span><strong className="text-foreground">Benchmarking:</strong> Scores are compared against local competitors in your category</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 font-medium">5.</span>
            <span><strong className="text-foreground">LBH Score:</strong> Final weighted average provides single health metric (0-100)</span>
          </li>
        </ol>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          <strong>Note:</strong> Score calculations are updated continuously as new data becomes available.
          Historical data is preserved to track trends over time. All algorithms are regularly refined to
          improve accuracy and relevance.
        </p>
      </div>
    </Card>
  );
}
