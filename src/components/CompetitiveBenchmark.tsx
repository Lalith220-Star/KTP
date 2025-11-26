import { Restaurant, ScoreFactor } from "../types/restaurant";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Award, AlertCircle } from "lucide-react";

interface CompetitiveBenchmarkProps {
  userBusiness: Restaurant;
  allRestaurants: Restaurant[];
}

export function CompetitiveBenchmark({ userBusiness, allRestaurants }: CompetitiveBenchmarkProps) {
  // Calculate industry averages for the same cuisine type
  const sameTypeRestaurants = allRestaurants.filter(
    r => r.cuisine === userBusiness.cuisine && r.id !== userBusiness.id
  );

  // Get top performers in the same category
  const topPerformers = [...sameTypeRestaurants]
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3);

  // Calculate averages
  const calculateAverage = (factorName: string) => {
    if (sameTypeRestaurants.length === 0) return 0;
    const total = sameTypeRestaurants.reduce((sum, r) => {
      const factor = r.factors.find(f => f.name === factorName);
      return sum + (factor?.score || 0);
    }, 0);
    return Math.round(total / sameTypeRestaurants.length);
  };

  const industryAvgScore = sameTypeRestaurants.length > 0
    ? Math.round(
        sameTypeRestaurants.reduce((sum, r) => sum + r.overallScore, 0) / 
        sameTypeRestaurants.length
      )
    : 0;

  const getComparisonColor = (userScore: number, avgScore: number) => {
    const diff = userScore - avgScore;
    if (diff >= 5) return "text-green-600 dark:text-green-400";
    if (diff <= -5) return "text-red-600 dark:text-red-400";
    return "text-yellow-600 dark:text-yellow-400";
  };

  const getComparisonIcon = (userScore: number, avgScore: number) => {
    const diff = userScore - avgScore;
    if (diff >= 5) return <TrendingUp className="w-4 h-4" />;
    if (diff <= -5) return <TrendingDown className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Overall Comparison */}
      <Card className="p-6">
        <h3 className="text-foreground mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          LBH Score vs. Industry Average
        </h3>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Your Score</div>
            <div className="text-3xl text-blue-600 dark:text-blue-400">
              {userBusiness.overallScore}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Industry Avg</div>
            <div className="text-3xl text-foreground">
              {industryAvgScore}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Difference</div>
            <div className={`text-3xl flex items-center justify-center gap-2 ${
              getComparisonColor(userBusiness.overallScore, industryAvgScore)
            }`}>
              {getComparisonIcon(userBusiness.overallScore, industryAvgScore)}
              {userBusiness.overallScore >= industryAvgScore ? "+" : ""}
              {userBusiness.overallScore - industryAvgScore}
            </div>
          </div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            {userBusiness.overallScore > industryAvgScore
              ? `You're performing ${userBusiness.overallScore - industryAvgScore} points above the ${userBusiness.cuisine} industry average! 🎉`
              : userBusiness.overallScore < industryAvgScore
              ? `Focus on improvements to match the ${userBusiness.cuisine} industry average of ${industryAvgScore}`
              : `You're right at the ${userBusiness.cuisine} industry average`
            }
          </p>
        </div>
      </Card>

      {/* Component Score Comparison */}
      <Card className="p-6">
        <h3 className="text-foreground mb-4">Component Score Analysis</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Compare your scores against {userBusiness.cuisine} restaurants in Richardson, TX
        </p>
        
        <div className="space-y-4">
          {userBusiness.factors.map((factor) => {
            const avgScore = calculateAverage(factor.name);
            const diff = factor.score - avgScore;
            
            return (
              <div key={factor.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{factor.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {factor.weight}% weight
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Avg: {avgScore}</span>
                    <span className={getComparisonColor(factor.score, avgScore)}>
                      You: {factor.score}
                    </span>
                    <span className={`flex items-center gap-1 ${getComparisonColor(factor.score, avgScore)}`}>
                      {diff > 0 ? "+" : ""}{diff}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <Progress value={avgScore} className="h-2 opacity-40" />
                  <div className="absolute top-0 left-0 right-0">
                    <Progress value={factor.score} className="h-2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Top Performers */}
      <Card className="p-6">
        <h3 className="text-foreground mb-4">Top Performers in {userBusiness.cuisine}</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Learn from the highest-rated {userBusiness.cuisine} restaurants
        </p>
        
        <div className="space-y-4">
          {topPerformers.map((restaurant, index) => (
            <div 
              key={restaurant.id}
              className="flex items-center gap-4 p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-400 text-white">
                {index + 1}
              </div>
              
              <div className="w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h4 className="text-foreground">{restaurant.name}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{restaurant.priceRange}</span>
                  <span>•</span>
                  <span>{restaurant.distance}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">LBH Score</div>
                <div className="text-2xl text-green-600 dark:text-green-400">
                  {restaurant.overallScore}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {topPerformers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No other {userBusiness.cuisine} restaurants found for comparison
          </div>
        )}
      </Card>
    </div>
  );
}
