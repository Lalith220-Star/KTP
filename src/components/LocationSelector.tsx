import { MapPin, Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";

export interface Location {
  id: string;
  name: string;
  state: string;
  displayName: string;
  coordinates: { lat: number; lng: number };
}

export const AVAILABLE_LOCATIONS: Location[] = [
  {
    id: "richardson-tx",
    name: "Richardson",
    state: "TX",
    displayName: "Richardson, TX",
    coordinates: { lat: 32.9483, lng: -96.7299 },
  },
  {
    id: "dallas-tx",
    name: "Dallas",
    state: "TX",
    displayName: "Dallas, TX",
    coordinates: { lat: 32.7767, lng: -96.7970 },
  },
  {
    id: "plano-tx",
    name: "Plano",
    state: "TX",
    displayName: "Plano, TX",
    coordinates: { lat: 33.0198, lng: -96.6989 },
  },
  {
    id: "frisco-tx",
    name: "Frisco",
    state: "TX",
    displayName: "Frisco, TX",
    coordinates: { lat: 33.1507, lng: -96.8236 },
  },
  {
    id: "austin-tx",
    name: "Austin",
    state: "TX",
    displayName: "Austin, TX",
    coordinates: { lat: 30.2672, lng: -97.7431 },
  },
];

interface LocationSelectorProps {
  currentLocation: Location;
  onLocationChange: (location: Location) => void;
}

export function LocationSelector({ currentLocation, onLocationChange }: LocationSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleLocationSelect = (location: Location) => {
    onLocationChange(location);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-muted-foreground">{currentLocation.displayName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Your Location</DialogTitle>
          <DialogDescription>
            Choose your area to see restaurants near you
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {AVAILABLE_LOCATIONS.map((location) => (
            <button
              key={location.id}
              onClick={() => handleLocationSelect(location)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                currentLocation.id === location.id
                  ? "bg-blue-50 dark:bg-blue-950 border-blue-500"
                  : "bg-background hover:bg-muted border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 ${
                  currentLocation.id === location.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground"
                }`} />
                <div className="text-left">
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-muted-foreground">{location.state}</p>
                </div>
              </div>
              {currentLocation.id === location.id && (
                <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
