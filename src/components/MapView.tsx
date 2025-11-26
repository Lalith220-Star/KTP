import { useState, useEffect } from "react";
import { Restaurant } from "../types/restaurant";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Navigation, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MapViewProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
}

export function MapView({ restaurants, onRestaurantClick }: MapViewProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [userLocation] = useState({ lat: 32.9483, lng: -96.7299 }); // Richardson, TX center

  // Calculate map bounds to show all restaurants
  const calculateBounds = () => {
    if (restaurants.length === 0) return null;
    
    const lats = restaurants.map(r => r.coordinates?.lat || userLocation.lat);
    const lngs = restaurants.map(r => r.coordinates?.lng || userLocation.lng);
    
    return {
      north: Math.max(...lats) + 0.05,
      south: Math.min(...lats) - 0.05,
      east: Math.max(...lngs) + 0.05,
      west: Math.min(...lngs) - 0.05,
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#1e40af"; // blue-800
    if (score >= 75) return "#2563eb"; // blue-600
    if (score >= 60) return "#6b7280"; // gray-500
    return "#9ca3af"; // gray-400
  };

  const bounds = calculateBounds();

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div className="absolute inset-0 bg-gray-200">
        {/* SVG Map Visualization */}
        <svg className="w-full h-full">
          {/* Grid lines for visual effect */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Restaurant Markers */}
          {restaurants.map((restaurant, index) => {
            if (!restaurant.coordinates) return null;
            
            // Calculate position on SVG (simplified projection)
            const x = bounds ? 
              ((restaurant.coordinates.lng - bounds.west) / (bounds.east - bounds.west)) * 100 : 
              50 + (index % 10) * 8;
            const y = bounds ? 
              (1 - (restaurant.coordinates.lat - bounds.south) / (bounds.north - bounds.south)) * 100 : 
              30 + Math.floor(index / 10) * 15;
            
            const isSelected = selectedRestaurant?.id === restaurant.id;
            const color = getScoreColor(restaurant.overallScore);
            
            return (
              <g 
                key={restaurant.id}
                transform={`translate(${x}%, ${y}%)`}
                onClick={() => setSelectedRestaurant(restaurant)}
                className="cursor-pointer transition-transform hover:scale-110"
                style={{ transformOrigin: "center" }}
              >
                {/* Marker Pin */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? "8" : "6"}
                  fill={color}
                  stroke="white"
                  strokeWidth={isSelected ? "3" : "2"}
                  className="transition-all"
                />
                {/* Score Label */}
                <text
                  x="0"
                  y="-12"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={color}
                  className="pointer-events-none"
                >
                  {restaurant.overallScore}
                </text>
              </g>
            );
          })}
          
          {/* User Location */}
          <g transform={`translate(50%, 50%)`}>
            <circle cx="0" cy="0" r="8" fill="#ef4444" stroke="white" strokeWidth="3" />
            <circle cx="0" cy="0" r="3" fill="white" />
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-card rounded-lg shadow-lg p-4 space-y-2 z-10 border">
        <h4 className="text-sm text-foreground mb-2">Score Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#1e40af" }}></div>
            <span className="text-foreground">90+ Exceptional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#2563eb" }}></div>
            <span className="text-foreground">75-89 Great</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#6b7280" }}></div>
            <span className="text-foreground">60-74 Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-foreground">Your Location</span>
          </div>
        </div>
      </div>

      {/* Restaurant Info Card */}
      {selectedRestaurant && (
        <div className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 z-10">
          <Card className="p-4 shadow-xl">
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={selectedRestaurant.image}
                  alt={selectedRestaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground mb-1 truncate">{selectedRestaurant.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedRestaurant.cuisine}
                  </Badge>
                  <Badge className="bg-blue-600 text-xs">
                    {selectedRestaurant.overallScore}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedRestaurant.distance}
                </p>
                <Button
                  size="sm"
                  onClick={() => onRestaurantClick(selectedRestaurant)}
                  className="w-full"
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Map Instructions */}
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-foreground shadow-md z-10 border">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-600" />
          <span>Click a marker to view restaurant details</span>
        </div>
      </div>
    </div>
  );
}
