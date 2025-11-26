import { useState } from "react";
import { Restaurant } from "../types/restaurant";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  X, MapPin, DollarSign, Star, Clock, Truck, ShoppingBag, 
  Calendar, Check, Minus 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { isRestaurantOpen } from "../utils/timeUtils";

interface ComparisonToolProps {
  restaurants: Restaurant[];
  initialRestaurants?: Restaurant[];
  onClose: () => void;
}

export function ComparisonTool({ restaurants, initialRestaurants = [], onClose }: ComparisonToolProps) {
  const [selectedRestaurants, setSelectedRestaurants] = useState<(Restaurant | null)[]>(
    [...initialRestaurants.slice(0, 3), null, null, null].slice(0, 3)
  );

  const handleSelectRestaurant = (index: number, restaurantId: string) => {
    const restaurant = restaurants.find(r => r.id === parseInt(restaurantId));
    if (restaurant) {
      const newSelected = [...selectedRestaurants];
      newSelected[index] = restaurant;
      setSelectedRestaurants(newSelected);
    }
  };

  const handleRemoveRestaurant = (index: number) => {
    const newSelected = [...selectedRestaurants];
    newSelected[index] = null;
    setSelectedRestaurants(newSelected);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-blue-700 bg-blue-100";
    if (score >= 75) return "text-blue-600 bg-blue-50";
    if (score >= 60) return "text-gray-700 bg-gray-100";
    return "text-gray-600 bg-gray-50";
  };

  const comparedRestaurants = selectedRestaurants.filter((r): r is Restaurant => r !== null);

  if (comparedRestaurants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground">Compare Restaurants</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <Card className="p-12 text-center">
            <h3 className="text-foreground mb-2">Select Restaurants to Compare</h3>
            <p className="text-muted-foreground mb-6">
              Choose 2-3 restaurants to see a detailed side-by-side comparison
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[0, 1, 2].map((index) => (
                <Select key={index} onValueChange={(value) => handleSelectRestaurant(index, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select Restaurant ${index + 1}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {restaurants.map((restaurant) => (
                      <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                        {restaurant.name} ({restaurant.overallScore})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const factorNames = comparedRestaurants[0]?.factors.map(f => f.name) || [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-foreground">Restaurant Comparison</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Restaurant Selection */}
        <Card className="p-6 mb-6">
          <h3 className="text-foreground mb-4">Comparing Restaurants</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <div key={index}>
                {selectedRestaurants[index] ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedRestaurants[index]?.id.toString()}
                      onValueChange={(value) => handleSelectRestaurant(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurants.map((restaurant) => (
                          <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                            {restaurant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRestaurant(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Select onValueChange={(value) => handleSelectRestaurant(index, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Add Restaurant ${index + 1}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.id.toString()}>
                          {restaurant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Basic Info */}
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              {comparedRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="p-6">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <ImageWithFallback
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-foreground mb-2">{restaurant.name}</h3>
                  <Badge variant="outline" className="mb-3">{restaurant.cuisine}</Badge>
                  <div className={`inline-block text-3xl px-4 py-2 rounded-lg ${getScoreColor(restaurant.overallScore)}`}>
                    {restaurant.overallScore}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Overall Scores Comparison */}
          <Card className="p-6">
            <h3 className="text-foreground mb-4">Score Breakdown</h3>
            <div className="space-y-6">
              {factorNames.map((factorName) => (
                <div key={factorName}>
                  <h4 className="text-foreground mb-3">{factorName}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {comparedRestaurants.map((restaurant) => {
                      const factor = restaurant.factors.find(f => f.name === factorName);
                      return (
                        <div key={restaurant.id}>
                          <div className="flex items-center justify-between mb-1 text-sm">
                            <span className="text-muted-foreground">{restaurant.name}</span>
                            <span className="text-foreground">{factor?.score}/100</span>
                          </div>
                          <Progress value={factor?.score || 0} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Details Comparison */}
          <Card className="p-6">
            <h3 className="text-foreground dark:text-foreground mb-4">Restaurant Details</h3>
            <div className="space-y-4">
              {/* Price Range */}
              <div className="grid grid-cols-4 gap-4 py-3 border-b">
                <div className="flex items-center gap-2 text-foreground dark:text-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>Price Range</span>
                </div>
                {comparedRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="text-foreground dark:text-foreground">
                    {restaurant.priceRange}
                  </div>
                ))}
              </div>

              {/* Distance */}
              <div className="grid grid-cols-4 gap-4 py-3 border-b">
                <div className="flex items-center gap-2 text-foreground dark:text-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Distance</span>
                </div>
                {comparedRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="text-foreground dark:text-foreground">
                    {restaurant.distance}
                  </div>
                ))}
              </div>

              {/* Open Now */}
              <div className="grid grid-cols-4 gap-4 py-3 border-b">
                <div className="flex items-center gap-2 text-foreground dark:text-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Status</span>
                </div>
                {comparedRestaurants.map((restaurant) => {
                  const isOpen = isRestaurantOpen(restaurant.hours);
                  return (
                    <div key={restaurant.id}>
                      <Badge className={isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                        {isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  );
                })}
              </div>

              {/* Delivery */}
              <div className="grid grid-cols-4 gap-4 py-3 border-b">
                <div className="flex items-center gap-2 text-foreground dark:text-foreground">
                  <Truck className="w-4 h-4" />
                  <span>Delivery</span>
                </div>
                {comparedRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="text-foreground dark:text-foreground">
                    {restaurant.hasDelivery ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Minus className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                ))}
              </div>

              {/* Takeout */}
              <div className="grid grid-cols-4 gap-4 py-3 border-b">
                <div className="flex items-center gap-2 text-foreground dark:text-foreground">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Takeout</span>
                </div>
                {comparedRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="text-foreground dark:text-foreground">
                    {restaurant.hasTakeout ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Minus className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                ))}
              </div>

              {/* Reservations */}
              <div className="grid grid-cols-4 gap-4 py-3 border-b">
                <div className="flex items-center gap-2 text-foreground dark:text-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Reservations</span>
                </div>
                {comparedRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="text-foreground dark:text-foreground">
                    {restaurant.reservationLink ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Minus className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                ))}
              </div>

              {/* Dietary Options */}
              <div className="grid grid-cols-4 gap-4 py-3">
                <div className="text-foreground dark:text-foreground">Dietary Options</div>
                {comparedRestaurants.map((restaurant) => (
                  <div key={restaurant.id} className="space-y-1">
                    {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 ? (
                      restaurant.dietaryOptions.map((option) => (
                        <Badge key={option} variant="outline" className="text-xs mr-1">
                          {option}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">None listed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}