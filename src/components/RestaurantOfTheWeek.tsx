import { Restaurant } from "../types/restaurant";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Award, TrendingUp, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RestaurantOfTheWeekProps {
  restaurant: Restaurant;
  onViewDetails: (restaurant: Restaurant) => void;
}

export function RestaurantOfTheWeek({ restaurant, onViewDetails }: RestaurantOfTheWeekProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white mb-8">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-6 h-6 text-yellow-400" />
          <h3 className="text-white">Restaurant of the Week</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-80 h-64 rounded-lg overflow-hidden bg-white/10">
            <ImageWithFallback
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white mb-2">{restaurant.name}</h2>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {restaurant.cuisine}
                  </Badge>
                  <Badge className="bg-yellow-400 text-yellow-900">
                    {restaurant.overallScore} Score
                  </Badge>
                </div>
                <p className="text-blue-100 mb-4">
                  {restaurant.description || "Experience exceptional dining at this outstanding restaurant."}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-blue-100">Highest Rated</span>
                </div>
                <p className="text-2xl">Top {restaurant.overallScore >= 90 ? "1%" : "5%"}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-blue-100">Trending</span>
                </div>
                <p className="text-2xl">+{Math.floor(Math.random() * 20) + 10}%</p>
              </div>
            </div>
            
            <Button
              onClick={() => onViewDetails(restaurant)}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              View Full Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
