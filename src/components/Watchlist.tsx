import { Restaurant } from "../types/restaurant";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, TrendingDown, Minus, Eye, X, Star, 
  Award, AlertCircle, BarChart3 
} from "lucide-react";
import { Progress } from "./ui/progress";

interface WatchlistProps {
  watchedRestaurants: Restaurant[];
  onRemoveFromWatchlist: (restaurantId: number) => void;
  onViewDetails: (restaurant: Restaurant) => void;
}

export function Watchlist({ 
  watchedRestaurants, 
  onRemoveFromWatchlist,
  onViewDetails 
}: WatchlistProps) {
  
  const getScoreTrend = (restaurant: Restaurant) => {
    if (!restaurant.scoreHistory || restaurant.scoreHistory.length < 2) {
      return { trend: "stable", change: 0 };
    }
    
    const sorted = [...restaurant.scoreHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latest = sorted[0].overallScore;
    const previous = sorted[1].overallScore;
    const change = latest - previous;
    
    return {
      trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
      change: Math.abs(change)
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 60) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  if (watchedRestaurants.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-foreground mb-2">No Businesses in Watchlist</h3>
        <p className="text-muted-foreground mb-6">
          Add competitors and other businesses to track their LBH Score changes over time
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {watchedRestaurants.map((restaurant) => {
        const trend = getScoreTrend(restaurant);
        
        return (
          <Card key={restaurant.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-foreground">{restaurant.name}</h3>
                      {restaurant.claimed && (
                        <Badge variant="secondary" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Claimed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{restaurant.cuisine}</span>
                      <span>•</span>
                      <span>{restaurant.priceRange}</span>
                      <span>•</span>
                      <span>{restaurant.distance}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">LBH Score</div>
                      <div className={`text-2xl ${getScoreColor(restaurant.overallScore)}`}>
                        {restaurant.overallScore}
                      </div>
                      
                      {trend.change > 0 && (
                        <div className="flex items-center gap-1 text-xs mt-1">
                          {trend.trend === "up" ? (
                            <>
                              <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                              <span className="text-green-600 dark:text-green-400">+{trend.change}</span>
                            </>
                          ) : trend.trend === "down" ? (
                            <>
                              <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                              <span className="text-red-600 dark:text-red-400">-{trend.change}</span>
                            </>
                          ) : (
                            <>
                              <Minus className="w-3 h-3 text-muted-foreground" />
                              <span className="text-muted-foreground">No change</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFromWatchlist(restaurant.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Factor Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {restaurant.factors.slice(0, 6).map((factor) => (
                    <div key={factor.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground truncate">{factor.name}</span>
                        <span className="text-foreground">{factor.score}</span>
                      </div>
                      <Progress value={factor.score} className="h-1.5" />
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(restaurant)}
                    className="gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
