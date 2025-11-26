import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Info, TrendingUp, Award, BarChart3 } from "lucide-react";
import { ScoreFactor } from "../types/restaurant";
import { Progress } from "./ui/progress";

interface LBHScoreExplainerProps {
  score: number;
  factors: ScoreFactor[];
}

export function LBHScoreExplainer({ score, factors }: LBHScoreExplainerProps) {
  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", color: "text-green-600 dark:text-green-400", label: "Exceptional" };
    if (score >= 85) return { grade: "A", color: "text-green-600 dark:text-green-400", label: "Excellent" };
    if (score >= 80) return { grade: "B+", color: "text-blue-600 dark:text-blue-400", label: "Very Good" };
    if (score >= 75) return { grade: "B", color: "text-blue-600 dark:text-blue-400", label: "Good" };
    if (score >= 70) return { grade: "C+", color: "text-yellow-600 dark:text-yellow-400", label: "Above Average" };
    if (score >= 65) return { grade: "C", color: "text-yellow-600 dark:text-yellow-400", label: "Average" };
    if (score >= 60) return { grade: "D", color: "text-orange-600 dark:text-orange-400", label: "Below Average" };
    return { grade: "F", color: "text-red-600 dark:text-red-400", label: "Needs Improvement" };
  };

  const scoreGrade = getScoreGrade(score);

  // Calculate the weighted contribution of each factor
  const calculateContribution = (factor: ScoreFactor) => {
    return (factor.score * factor.weight) / 100;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Info className="w-4 h-4" />
          What is LBH Score?
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Local Business Health (LBH) Score
          </DialogTitle>
          <DialogDescription>
            Proprietary metric measuring overall business performance (0-100)
          </DialogDescription>
        </DialogHeader>

        {/* What is LBH Score Section */}
        <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <h4 className="text-foreground mb-2">Understanding Your LBH Score</h4>
          <p className="text-sm text-muted-foreground mb-3">
            The Local Business Health (LBH) Score is a comprehensive metric that analyzes your restaurant's 
            operational health by processing publicly available data from reviews, job postings, social media, 
            and operational patterns.
          </p>
          <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">Your Score: {score}/100</strong> - {scoreGrade.label}
          </div>
        </Card>

        {/* Three Core Components */}
        <div className="mt-4">
          <h4 className="text-foreground mb-3">Three Core Components</h4>
          <div className="space-y-3">
            <Card className="p-4 border-l-4 border-l-green-500">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h5 className="text-foreground mb-1">1. Customer Sentiment (40% weight)</h5>
                  <p className="text-sm text-muted-foreground">
                    Analyzes review text, ratings trends, sentiment analysis, and customer feedback patterns 
                    across multiple platforms to gauge overall satisfaction.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h5 className="text-foreground mb-1">2. Operational Consistency (35% weight)</h5>
                  <p className="text-sm text-muted-foreground">
                    Tracks hours changes, menu updates, response times to reviews, and operational pattern 
                    stability to measure reliability and management effectiveness.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-l-4 border-l-purple-500">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h5 className="text-foreground mb-1">3. Talent Stability (25% weight)</h5>
                  <p className="text-sm text-muted-foreground">
                    Monitors job posting frequency, employee tenure indicators from reviews, and hiring 
                    patterns to assess team stability and workplace culture.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}