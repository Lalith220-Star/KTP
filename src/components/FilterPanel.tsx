import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Slider } from "./ui/slider";
import { 
  SlidersHorizontal, X, DollarSign, MapPin, Star, 
  TrendingUp, BarChart3, Users, Tag, Clock
} from "lucide-react";

export interface FilterOptions {
  scoreRange: [number, number];
  cuisineTypes: string[];
  priceRanges: string[];
  cities: string[];
  openNow: boolean;
  hasDeals: boolean;
  lbhComponents?: {
    customerSentiment?: [number, number];
    operationalConsistency?: [number, number];
    talentStability?: [number, number];
  };
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availableCuisines?: string[];
  availableCities?: string[];
  showAdvanced?: boolean;
}

export function FilterPanel({
  filters,
  onFilterChange,
  availableCuisines = [],
  availableCities = [],
  showAdvanced = false
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const priceOptions = ["$", "$$", "$$$", "$$$$"];

  const toggleCuisine = (cuisine: string) => {
    const newCuisines = filters.cuisineTypes.includes(cuisine)
      ? filters.cuisineTypes.filter(c => c !== cuisine)
      : [...filters.cuisineTypes, cuisine];
    onFilterChange({ ...filters, cuisineTypes: newCuisines });
  };

  const togglePrice = (price: string) => {
    const newPrices = filters.priceRanges.includes(price)
      ? filters.priceRanges.filter(p => p !== price)
      : [...filters.priceRanges, price];
    onFilterChange({ ...filters, priceRanges: newPrices });
  };

  const toggleCity = (city: string) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter(c => c !== city)
      : [...filters.cities, city];
    onFilterChange({ ...filters, cities: newCities });
  };

  const clearAllFilters = () => {
    onFilterChange({
      scoreRange: [0, 100],
      cuisineTypes: [],
      priceRanges: [],
      cities: [],
      openNow: false,
      hasDeals: false,
      lbhComponents: showAdvanced ? {
        customerSentiment: [0, 100],
        operationalConsistency: [0, 100],
        talentStability: [0, 100]
      } : undefined
    });
  };

  const activeFilterCount = 
    filters.cuisineTypes.length + 
    filters.priceRanges.length + 
    filters.cities.length +
    (filters.openNow ? 1 : 0) +
    (filters.hasDeals ? 1 : 0) +
    (filters.scoreRange[0] !== 0 || filters.scoreRange[1] !== 100 ? 1 : 0);

  return (
    <div className="relative">
      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 relative"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <Badge 
            variant="default" 
            className="ml-1 px-1.5 py-0 text-xs bg-blue-600"
          >
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <Card className="absolute right-0 top-12 w-96 max-h-[600px] overflow-y-auto z-50 p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </h3>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator className="mb-4" />

            {/* Overall Score Range */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <label className="text-sm text-foreground">Overall Score</label>
              </div>
              <div className="px-2">
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={filters.scoreRange}
                  onValueChange={(value) => 
                    onFilterChange({ ...filters, scoreRange: value as [number, number] })
                  }
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{filters.scoreRange[0]}</span>
                  <span>{filters.scoreRange[1]}</span>
                </div>
              </div>
            </div>

            <Separator className="mb-4" />

            {/* Cuisine Types */}
            {availableCuisines.length > 0 && (
              <>
                <div className="mb-4">
                  <label className="text-sm text-foreground mb-2 block">Cuisine Type</label>
                  <div className="flex flex-wrap gap-2">
                    {availableCuisines.map((cuisine) => (
                      <Badge
                        key={cuisine}
                        variant={filters.cuisineTypes.includes(cuisine) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.cuisineTypes.includes(cuisine)
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "hover:bg-blue-50 dark:hover:bg-blue-950"
                        }`}
                        onClick={() => toggleCuisine(cuisine)}
                      >
                        {cuisine}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator className="mb-4" />
              </>
            )}

            {/* Price Range */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <label className="text-sm text-foreground">Price Range</label>
              </div>
              <div className="flex gap-2">
                {priceOptions.map((price) => (
                  <Badge
                    key={price}
                    variant={filters.priceRanges.includes(price) ? "default" : "outline"}
                    className={`cursor-pointer flex-1 justify-center ${
                      filters.priceRanges.includes(price)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:bg-blue-50 dark:hover:bg-blue-950"
                    }`}
                    onClick={() => togglePrice(price)}
                  >
                    {price}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="mb-4" />

            {/* Cities */}
            {availableCities.length > 0 && (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <label className="text-sm text-foreground">Location</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableCities.map((city) => (
                      <Badge
                        key={city}
                        variant={filters.cities.includes(city) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          filters.cities.includes(city)
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "hover:bg-blue-50 dark:hover:bg-blue-950"
                        }`}
                        onClick={() => toggleCity(city)}
                      >
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator className="mb-4" />
              </>
            )}

            {/* Quick Filters */}
            <div className="mb-4">
              <label className="text-sm text-foreground mb-2 block">Quick Filters</label>
              <div className="space-y-2">
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    filters.openNow
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                      : "border-border hover:bg-muted"
                  }`}
                  onClick={() => onFilterChange({ ...filters, openNow: !filters.openNow })}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-foreground">Open Now</span>
                  </div>
                  {filters.openNow && (
                    <Badge variant="default" className="bg-blue-600 text-xs">Active</Badge>
                  )}
                </div>

                <div
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    filters.hasDeals
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                      : "border-border hover:bg-muted"
                  }`}
                  onClick={() => onFilterChange({ ...filters, hasDeals: !filters.hasDeals })}
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm text-foreground">Has Deals</span>
                  </div>
                  {filters.hasDeals && (
                    <Badge variant="default" className="bg-blue-600 text-xs">Active</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Advanced LBH Filters */}
            {showAdvanced && (
              <>
                <Separator className="mb-4" />
                <div className="mb-4">
                  <h4 className="text-sm text-foreground mb-3">LBH Score Components</h4>
                  
                  {/* Customer Sentiment */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      <label className="text-xs text-foreground">Customer Sentiment</label>
                    </div>
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={filters.lbhComponents?.customerSentiment || [0, 100]}
                        onValueChange={(value) =>
                          onFilterChange({
                            ...filters,
                            lbhComponents: {
                              ...filters.lbhComponents,
                              customerSentiment: value as [number, number]
                            }
                          })
                        }
                        className="mb-1"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{filters.lbhComponents?.customerSentiment?.[0] || 0}</span>
                        <span>{filters.lbhComponents?.customerSentiment?.[1] || 100}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Consistency */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <label className="text-xs text-foreground">Operational Consistency</label>
                    </div>
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={filters.lbhComponents?.operationalConsistency || [0, 100]}
                        onValueChange={(value) =>
                          onFilterChange({
                            ...filters,
                            lbhComponents: {
                              ...filters.lbhComponents,
                              operationalConsistency: value as [number, number]
                            }
                          })
                        }
                        className="mb-1"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{filters.lbhComponents?.operationalConsistency?.[0] || 0}</span>
                        <span>{filters.lbhComponents?.operationalConsistency?.[1] || 100}</span>
                      </div>
                    </div>
                  </div>

                  {/* Talent Stability */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      <label className="text-xs text-foreground">Talent Stability</label>
                    </div>
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={filters.lbhComponents?.talentStability || [0, 100]}
                        onValueChange={(value) =>
                          onFilterChange({
                            ...filters,
                            lbhComponents: {
                              ...filters.lbhComponents,
                              talentStability: value as [number, number]
                            }
                          })
                        }
                        className="mb-1"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{filters.lbhComponents?.talentStability?.[0] || 0}</span>
                        <span>{filters.lbhComponents?.talentStability?.[1] || 100}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Apply Button */}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Apply Filters
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}
