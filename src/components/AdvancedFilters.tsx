import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export interface FilterState {
  category: string;
  priceRange: string;
  scoreRange: number[];
  distance: number[];
  sortBy: string;
  openNow: boolean;
  hasDelivery: boolean;
  hasTakeout: boolean;
  hasReservations: boolean;
  dietaryOptions: string[];
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  categories: string[];
  priceRanges: string[];
  hasActiveFilters: boolean;
}

const dietaryOptionsList = [
  "Vegetarian Options",
  "Vegan Options",
  "Gluten-Free Options",
];

const sortOptions = [
  { value: "score-desc", label: "Highest Score" },
  { value: "score-asc", label: "Lowest Score" },
  { value: "distance-asc", label: "Nearest First" },
  { value: "distance-desc", label: "Farthest First" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

export function AdvancedFilters({
  filters,
  onFilterChange,
  onClearFilters,
  categories,
  priceRanges,
  hasActiveFilters,
}: AdvancedFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full gap-2"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </Button>
      )}

      {/* Sort By */}
      <div>
        <Label className="mb-2 block">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(value) => onFilterChange({ sortBy: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div>
        <Label className="mb-2 block">Cuisine Type</Label>
        <Select value={filters.category} onValueChange={(value) => onFilterChange({ category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label className="mb-2 block">Price Range</Label>
        <Select
          value={filters.priceRange}
          onValueChange={(value) => onFilterChange({ priceRange: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range === "All" ? "All Prices" : range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Score Range */}
      <div>
        <Label className="mb-3 block">
          Score Range: {filters.scoreRange[0]} - {filters.scoreRange[1]}
        </Label>
        <Slider
          min={0}
          max={100}
          step={5}
          value={filters.scoreRange}
          onValueChange={(value) => onFilterChange({ scoreRange: value })}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground dark:text-muted-foreground">
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      {/* Distance */}
      <div>
        <Label className="mb-3 block">
          Max Distance: {filters.distance[1]} mi
        </Label>
        <Slider
          min={0}
          max={10}
          step={0.5}
          value={filters.distance}
          onValueChange={(value) => onFilterChange({ distance: value })}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground dark:text-muted-foreground">
          <span>0 mi</span>
          <span>10 mi</span>
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <Label className="mb-3 block">Quick Filters</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="openNow"
              checked={filters.openNow}
              onCheckedChange={(checked) =>
                onFilterChange({ openNow: checked as boolean })
              }
            />
            <label
              htmlFor="openNow"
              className="text-sm text-foreground dark:text-foreground cursor-pointer"
            >
              Open Now
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasDelivery"
              checked={filters.hasDelivery}
              onCheckedChange={(checked) =>
                onFilterChange({ hasDelivery: checked as boolean })
              }
            />
            <label
              htmlFor="hasDelivery"
              className="text-sm text-foreground dark:text-foreground cursor-pointer"
            >
              Offers Delivery
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasTakeout"
              checked={filters.hasTakeout}
              onCheckedChange={(checked) =>
                onFilterChange({ hasTakeout: checked as boolean })
              }
            />
            <label
              htmlFor="hasTakeout"
              className="text-sm text-foreground dark:text-foreground cursor-pointer"
            >
              Offers Takeout
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasReservations"
              checked={filters.hasReservations}
              onCheckedChange={(checked) =>
                onFilterChange({ hasReservations: checked as boolean })
              }
            />
            <label
              htmlFor="hasReservations"
              className="text-sm text-foreground dark:text-foreground cursor-pointer"
            >
              Accepts Reservations
            </label>
          </div>
        </div>
      </div>

      {/* Dietary Options */}
      <div>
        <Label className="mb-3 block">Dietary Options</Label>
        <div className="space-y-3">
          {dietaryOptionsList.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={filters.dietaryOptions.includes(option)}
                onCheckedChange={(checked) => {
                  const newOptions = checked
                    ? [...filters.dietaryOptions, option]
                    : filters.dietaryOptions.filter((o) => o !== option);
                  onFilterChange({ dietaryOptions: newOptions });
                }}
              />
              <label
                htmlFor={option}
                className="text-sm text-foreground dark:text-foreground cursor-pointer"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <Label className="mb-2 block">Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {filters.category !== "All" && (
              <Badge variant="secondary">{filters.category}</Badge>
            )}
            {filters.priceRange !== "All" && (
              <Badge variant="secondary">{filters.priceRange}</Badge>
            )}
            {filters.openNow && <Badge variant="secondary">Open Now</Badge>}
            {filters.hasDelivery && <Badge variant="secondary">Delivery</Badge>}
            {filters.hasTakeout && <Badge variant="secondary">Takeout</Badge>}
            {filters.hasReservations && (
              <Badge variant="secondary">Reservations</Badge>
            )}
            {filters.dietaryOptions.map((option) => (
              <Badge key={option} variant="secondary">
                {option}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}