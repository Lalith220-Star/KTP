import { Restaurant } from "../types/restaurant";
import { Navigation } from "lucide-react";

interface MapViewProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
}

export function MapView({ restaurants, onRestaurantClick }: MapViewProps) {
  // Richardson, TX bounding box
  const mapBounds = {
    west: -96.78068,
    east: -96.67063,
    south: 32.91047,
    north: 33.00492
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#1e40af"; // blue-800
    if (score >= 75) return "#2563eb"; // blue-600
    if (score >= 60) return "#6b7280"; // gray-500
    return "#9ca3af"; // gray-400
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
        {/* Simple grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <line x1="0" y1="50" x2="100" y2="50" stroke="#94a3b8" strokeWidth="2"/>
              <line x1="50" y1="0" x2="50" y2="100" stroke="#94a3b8" strokeWidth="2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Richardson label */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/80 px-4 py-2 rounded-lg shadow-md z-10">
          <h3 className="text-lg font-semibold text-gray-700">Richardson, TX</h3>
          <p className="text-sm text-gray-500">Restaurant Map</p>
        </div>
        
        {/* SVG Overlay for Restaurant Markers */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet">
          <rect width="100%" height="100%" fill="transparent" />
          
          {/* Restaurant Markers */}
          {restaurants.map((restaurant) => {
            if (!restaurant.coordinates) return null;
            
            // Calculate position using map bounds
            const x = ((restaurant.coordinates.lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 1000;
            const y = (1 - (restaurant.coordinates.lat - mapBounds.south) / (mapBounds.north - mapBounds.south)) * 600;
            
            const color = getScoreColor(restaurant.overallScore);
            
            return (
              <g 
                key={restaurant.id}
                transform={`translate(${x.toFixed(1)}, ${y.toFixed(1)})`}
                onClick={() => onRestaurantClick(restaurant)}
                className="cursor-pointer transition-transform hover:scale-110 pointer-events-auto"
                style={{ transformOrigin: "center" }}
              >
                {/* Marker Pin */}
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
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
          
          {/* User Location - Richardson Center */}
          <g transform="translate(500, 300)">
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
