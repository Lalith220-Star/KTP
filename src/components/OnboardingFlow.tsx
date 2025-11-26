import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  MapPin, ChefHat, Building2, TrendingUp, 
  ArrowRight, ArrowLeft, Check, Star, X
} from "lucide-react";
import { Restaurant } from "../types/restaurant";
import { Location } from "./LocationSelector";
import { Input } from "./ui/input";

interface OnboardingFlowProps {
  restaurants: Restaurant[];
  availableLocations: Location[];
  availableCuisines: string[];
  onComplete: (preferences: {
    location: Location;
    cuisinePreferences: string[];
    claimedRestaurant?: Restaurant;
    isBusiness: boolean;
  }) => void;
  onSkip: () => void;
  isBusiness?: boolean;
}

export function OnboardingFlow({
  restaurants,
  availableLocations,
  availableCuisines,
  onComplete,
  onSkip,
  isBusiness = false
}: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [userType, setUserType] = useState<"customer" | "business" | null>(isBusiness ? "business" : null);
  const [searchQuery, setSearchQuery] = useState("");

  const totalSteps = userType === "business" ? 4 : 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    if (!selectedLocation) return;

    onComplete({
      location: selectedLocation,
      cuisinePreferences: selectedCuisines,
      claimedRestaurant: selectedRestaurant || undefined,
      isBusiness: userType === "business"
    });
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return userType !== null;
      case 2:
        return selectedLocation !== null;
      case 3:
        return selectedCuisines.length > 0;
      case 4:
        return userType === "customer" || selectedRestaurant !== null;
      default:
        return false;
    }
  };

  // Filter restaurants for claiming
  const locationRestaurants = selectedLocation 
    ? restaurants.filter(r => r.address.includes(selectedLocation.displayName))
    : [];

  const filteredRestaurants = searchQuery
    ? locationRestaurants.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : locationRestaurants;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-foreground mb-1">Welcome to Localytics! 🎉</h2>
              <p className="text-muted-foreground text-sm">
                Let's personalize your experience
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-colors ${
                  index + 1 < step 
                    ? "bg-green-600 text-white"
                    : index + 1 === step
                    ? "bg-blue-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {index + 1 < step ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-colors ${
                    index + 1 < step ? "bg-green-600" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 min-h-[400px]">
          {/* Step 1: User Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-foreground mb-2">How will you use Localytics?</h3>
                <p className="text-muted-foreground">
                  Choose the option that best describes you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={`p-6 cursor-pointer transition-all border-2 hover:shadow-lg ${
                    userType === "customer"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                      : "border-border hover:border-blue-300"
                  }`}
                  onClick={() => setUserType("customer")}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Star className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-foreground mb-2">Customer</h4>
                      <p className="text-sm text-muted-foreground">
                        Discover and explore top-rated restaurants in your area
                      </p>
                    </div>
                    {userType === "customer" && (
                      <Badge className="bg-blue-600">Selected</Badge>
                    )}
                  </div>
                </Card>

                <Card
                  className={`p-6 cursor-pointer transition-all border-2 hover:shadow-lg ${
                    userType === "business"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                      : "border-border hover:border-blue-300"
                  }`}
                  onClick={() => setUserType("business")}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-foreground mb-2">Restaurant Owner</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor your LBH Score and get operational insights
                      </p>
                    </div>
                    {userType === "business" && (
                      <Badge className="bg-blue-600">Selected</Badge>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-foreground mb-2">Select Your Location</h3>
                <p className="text-muted-foreground">
                  {userType === "business" 
                    ? "Where is your restaurant located?"
                    : "Which area would you like to explore?"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableLocations.map((location) => {
                  const locationRestaurantCount = restaurants.filter(r => 
                    r.address.includes(location.displayName)
                  ).length;

                  return (
                    <Card
                      key={location.id}
                      className={`p-4 cursor-pointer transition-all border-2 hover:shadow-md ${
                        selectedLocation?.id === location.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                          : "border-border hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-foreground mb-1">{location.displayName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {locationRestaurantCount} restaurant{locationRestaurantCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {selectedLocation?.id === location.id && (
                          <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Cuisine Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <ChefHat className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-foreground mb-2">Choose Your Cuisine Preferences</h3>
                <p className="text-muted-foreground">
                  {userType === "business"
                    ? "What type of cuisine does your restaurant serve?"
                    : "Select the types of cuisine you're interested in (choose at least one)"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {availableCuisines.map((cuisine) => (
                  <Badge
                    key={cuisine}
                    variant={selectedCuisines.includes(cuisine) ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                      selectedCuisines.includes(cuisine)
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "hover:bg-blue-50 dark:hover:bg-blue-950 hover:border-blue-600"
                    }`}
                    onClick={() => toggleCuisine(cuisine)}
                  >
                    {cuisine}
                    {selectedCuisines.includes(cuisine) && (
                      <Check className="w-3 h-3 ml-2" />
                    )}
                  </Badge>
                ))}
              </div>

              {selectedCuisines.length > 0 && (
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    {selectedCuisines.length} cuisine{selectedCuisines.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Claim Restaurant (Business Only) */}
          {step === 4 && userType === "business" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-foreground mb-2">Claim Your Restaurant</h3>
                <p className="text-muted-foreground">
                  Find and claim your restaurant to access the dashboard
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search by restaurant name, cuisine, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Restaurant List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {filteredRestaurants.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? "No restaurants found matching your search" : "No restaurants in this location"}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Choose Different Location
                    </Button>
                  </div>
                ) : (
                  filteredRestaurants.map((restaurant) => (
                    <Card
                      key={restaurant.id}
                      className={`p-4 cursor-pointer transition-all border-2 hover:shadow-md ${
                        selectedRestaurant?.id === restaurant.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                          : "border-border hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedRestaurant(restaurant)}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-foreground mb-1">{restaurant.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{restaurant.cuisine}</span>
                                <span>•</span>
                                <span>{restaurant.priceRange}</span>
                                {restaurant.claimed && (
                                  <>
                                    <span>•</span>
                                    <Badge variant="outline" className="text-xs">
                                      Already Claimed
                                    </Badge>
                                  </>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {restaurant.address}
                              </p>
                            </div>
                            {selectedRestaurant?.id === restaurant.id && (
                              <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {selectedRestaurant && selectedRestaurant.claimed && (
                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ This restaurant has already been claimed by another user. Please contact support if you believe this is an error.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-muted/50">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </div>

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
