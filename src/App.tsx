import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { RestaurantCard } from "./components/RestaurantCard";
import { RestaurantDetail } from "./components/RestaurantDetail";
import { BusinessDashboard } from "./components/BusinessDashboard";
import { AuthModal } from "./components/AuthModal";
import { AddBusinessForm } from "./components/AddBusinessForm";
import { MapView } from "./components/MapView";
import { ComparisonTool } from "./components/ComparisonTool";
import { UserProfile } from "./components/UserProfile";
import { AccountSettings } from "./components/AccountSettings";
import { HelpCenter } from "./components/HelpCenter";
import { LegalPages } from "./components/LegalPages";
import { RecentActivity } from "./components/RecentActivity";
import { RestaurantOfTheWeek } from "./components/RestaurantOfTheWeek";
import { RestaurantCardSkeleton } from "./components/RestaurantCardSkeleton";
import { AdvancedFilters, FilterState } from "./components/AdvancedFilters";
import { FilterPanel, FilterOptions } from "./components/FilterPanel";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { ExportButton } from "./components/ExportButton";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocationSelector, AVAILABLE_LOCATIONS, Location } from "./components/LocationSelector";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { SlidersHorizontal, X, Heart, Map, ArrowLeftRight, User as UserIcon, Activity } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { toast, Toaster } from "sonner@2.0.3";
import { Restaurant, Review, User, UserActivity } from "./types/restaurant";
import { getRestaurantsByLocation } from "./data/allRestaurantsData";
import { isRestaurantOpen } from "./utils/timeUtils";

const categories = ["All", "American", "Asian", "BBQ", "Breakfast", "Burgers", "Indian", "Italian", "Japanese", "Mediterranean", "Mexican", "Seafood", "Vietnamese"];
const priceRanges = ["All", "$", "$$", "$$$"];

// Initial reviews data
const initialReviews: Review[] = [
  {
    id: "1",
    restaurantId: 1,
    userEmail: "foodie@example.com",
    rating: 5,
    comment: "Absolutely amazing experience! The wood-grilled steaks are perfection. Service was impeccable and the ambiance is perfect for special occasions.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulVotes: 12,
    votedBy: [],
  },
  {
    id: "2",
    restaurantId: 2,
    userEmail: "sushi_lover@example.com",
    rating: 5,
    comment: "Best izakaya in Richardson! Fresh sashimi, creative rolls, and great sake selection. The atmosphere is authentic and cozy.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulVotes: 8,
    votedBy: [],
  },
  {
    id: "3",
    restaurantId: 10,
    userEmail: "steak_fan@example.com",
    rating: 5,
    comment: "Outstanding steakhouse with a modern twist. The filet was cooked to perfection and the sides were excellent. A bit pricey but worth it!",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulVotes: 15,
    votedBy: [],
  },
  {
    id: "4",
    restaurantId: 4,
    userEmail: "italian_cuisine@example.com",
    rating: 4,
    comment: "Great Italian food with generous portions. The pasta is homemade and delicious. Highly recommend the chicken parmigiana!",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulVotes: 6,
    votedBy: [],
  },
  {
    id: "5",
    restaurantId: 5,
    userEmail: "bbq_master@example.com",
    rating: 5,
    comment: "Authentic Texas BBQ at its finest! The brisket melts in your mouth and the ribs are fall-off-the-bone tender. Can't beat the quality for the price.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulVotes: 20,
    votedBy: [],
  },
  {
    id: "6",
    restaurantId: 14,
    userEmail: "spice_lover@example.com",
    rating: 4,
    comment: "Excellent Indian food with authentic flavors. The butter chicken is creamy and flavorful. Great value for money!",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulVotes: 9,
    votedBy: [],
  },
  {
    id: "7",
    restaurantId: 13,
    userEmail: "burger_enthusiast@example.com",
    rating: 4,
    comment: "Creative burger combinations and quality ingredients. Love the exotic game meat options. Fries are crispy and delicious!",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulVotes: 5,
    votedBy: [],
  },
  {
    id: "8",
    restaurantId: 1,
    userEmail: "date_night@example.com",
    rating: 5,
    comment: "Perfect restaurant for date night. The steaks are amazing, the wine selection is excellent, and the service is top-notch. The ambiance is romantic and elegant.",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulVotes: 14,
    votedBy: [],
  },
  {
    id: "9",
    restaurantId: 1,
    userEmail: "meat_lover@example.com",
    rating: 4,
    comment: "Great steaks and excellent sides. The meat quality is outstanding. Service was friendly and attentive. Highly recommend!",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    helpfulVotes: 7,
    votedBy: [],
  },
];

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<Location>(AVAILABLE_LOCATIONS[0]); // Richardson by default
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddBusinessDialog, setShowAddBusinessDialog] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "dashboard" | "detail" | "map" | "comparison" | "profile" | "settings" | "help" | "legal">("home");
  const [restaurants, setRestaurants] = useState<Restaurant[]>(getRestaurantsByLocation(AVAILABLE_LOCATIONS[0].id));
  const [userBusinessId, setUserBusinessId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    priceRange: "All",
    scoreRange: [0, 100],
    distance: [0, 10],
    sortBy: "score-desc",
    openNow: false,
    hasDelivery: false,
    hasTakeout: false,
    hasReservations: false,
    dietaryOptions: [],
  });

  // New filter panel state
  const [newFilterOptions, setNewFilterOptions] = useState<FilterOptions>({
    scoreRange: [0, 100],
    cuisineTypes: [],
    priceRanges: [],
    cities: [],
    openNow: false,
    hasDeals: false,
    lbhComponents: {
      customerSentiment: [0, 100],
      operationalConsistency: [0, 100],
      talentStability: [0, 100]
    }
  });

  // Generate initial activities
  useEffect(() => {
    const initialActivities: UserActivity[] = [
      ...initialReviews.slice(0, 5).map((review, idx) => ({
        id: `act-${idx}`,
        type: 'review' as const,
        userEmail: review.userEmail,
        restaurantId: review.restaurantId,
        restaurantName: restaurants.find(r => r.id === review.restaurantId)?.name || "",
        content: review.comment,
        rating: review.rating,
        date: review.date,
      })),
      {
        id: 'act-new-1',
        type: 'new_restaurant' as const,
        userEmail: 'system',
        restaurantId: 1,
        restaurantName: "Jasper's Restaurant",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
    setActivities(initialActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  const handleSignIn = (email: string, isBusiness: boolean) => {
    setUser({ email, isBusiness, memberSince: "November 2024" });
    
    // Show onboarding for new users
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    } else if (isBusiness) {
      setCurrentView("dashboard");
    }
    
    toast.success(`Welcome back, ${email}!`);
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentView("home");
    setUserBusinessId(null);
    setFavorites([]);
    setActiveTab("all");
    toast.success("Signed out successfully");
  };

  const handleToggleFavorite = (restaurantId: number) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      setShowAuthModal(true);
      return;
    }
    
    setFavorites(prev => {
      if (prev.includes(restaurantId)) {
        toast.success("Removed from favorites");
        return prev.filter(id => id !== restaurantId);
      } else {
        toast.success("Added to favorites");
        // Add activity
        const restaurant = restaurants.find(r => r.id === restaurantId);
        if (restaurant) {
          const newActivity: UserActivity = {
            id: `act-${Date.now()}`,
            type: 'favorite',
            userEmail: user.email,
            restaurantId,
            restaurantName: restaurant.name,
            date: new Date().toISOString(),
          };
          setActivities(prev => [newActivity, ...prev].slice(0, 20));
        }
        return [...prev, restaurantId];
      }
    });
  };

  const handleToggleWatchlist = (restaurantId: number) => {
    setWatchlist(prev => {
      const isInWatchlist = prev.includes(restaurantId);
      if (isInWatchlist) {
        toast.info("Removed from watchlist");
        return prev.filter(id => id !== restaurantId);
      } else {
        const restaurant = restaurants.find(r => r.id === restaurantId);
        toast.success(`Added ${restaurant?.name} to watchlist`);
        return [...prev, restaurantId];
      }
    });
  };

  const handleAddReview = (restaurantId: number, rating: number, comment: string) => {
    if (!user) {
      toast.error("Please sign in to leave a review");
      setShowAuthModal(true);
      return;
    }

    const newReview: Review = {
      id: `${Date.now()}-${Math.random()}`,
      restaurantId,
      userEmail: user.email,
      rating,
      comment,
      date: new Date().toISOString(),
      helpfulVotes: 0,
      votedBy: [],
    };

    setReviews(prev => [...prev, newReview]);
    
    // Add activity
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      const newActivity: UserActivity = {
        id: `act-${Date.now()}`,
        type: 'review',
        userEmail: user.email,
        restaurantId,
        restaurantName: restaurant.name,
        content: comment,
        rating,
        date: new Date().toISOString(),
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 20));
    }
    
    toast.success("Review submitted successfully!");
  };

  const handleVoteReview = (reviewId: string, helpful: boolean) => {
    if (!user) {
      toast.error("Please sign in to vote");
      setShowAuthModal(true);
      return;
    }

    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        if (review.votedBy?.includes(user.email)) {
          toast.info("You've already voted on this review");
          return review;
        }
        toast.success("Thank you for your feedback!");
        return {
          ...review,
          helpfulVotes: (review.helpfulVotes || 0) + 1,
          votedBy: [...(review.votedBy || []), user.email],
        };
      }
      return review;
    }));
  };

  const handleReplyToReview = (reviewId: string, reply: string) => {
    if (!user || !user.isBusiness) return;

    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          response: {
            text: reply,
            date: new Date().toISOString(),
            ownerName: user.email,
          },
        };
      }
      return review;
    }));
  };

  const handleAddBusiness = (businessData: any) => {
    const newBusiness: Restaurant = {
      id: userBusinessId || restaurants.length + 1,
      name: businessData.name,
      cuisine: businessData.cuisine,
      address: businessData.address,
      priceRange: businessData.priceRange,
      distance: "0.0 mi",
      image: "https://images.unsplash.com/photo-1639241137671-6234af6b188d?w=400",
      overallScore: 75,
      factors: [
        { name: "Food Quality", score: 78, weight: 30 },
        { name: "Service", score: 72, weight: 25 },
        { name: "Ambiance", score: 76, weight: 15 },
        { name: "Value for Money", score: 80, weight: 15 },
        { name: "Cleanliness", score: 74, weight: 10 },
        { name: "Location", score: 70, weight: 5 },
      ],
      phone: businessData.phone,
      description: businessData.description,
      claimed: true,
      claimedBy: user?.email,
    };

    if (userBusinessId) {
      setRestaurants(prev => prev.map(r => r.id === userBusinessId ? newBusiness : r));
      toast.success("Business information updated!");
    } else {
      setRestaurants(prev => [...prev, newBusiness]);
      setUserBusinessId(newBusiness.id);
      
      // Convert regular user to business user
      if (user && !user.isBusiness) {
        setUser({ ...user, isBusiness: true });
      }
      
      toast.success("Business added successfully! You can now access your dashboard.");
    }
    
    setShowAddBusinessDialog(false);
    
    // Navigate to dashboard if newly created
    if (!userBusinessId) {
      setCurrentView("dashboard");
    }
  };

  const handleAddBusinessClick = () => {
    if (!user) {
      toast.info("Please sign in to add your business");
      setShowAuthModal(true);
    } else if (user.isBusiness) {
      toast.info("You already have a business. Visit your dashboard to manage it.");
      setCurrentView("dashboard");
    } else {
      setShowAddBusinessDialog(true);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      category: "All",
      priceRange: "All",
      scoreRange: [0, 100],
      distance: [0, 10],
      sortBy: "score-desc",
      openNow: false,
      hasDelivery: false,
      hasTakeout: false,
      hasReservations: false,
      dietaryOptions: [],
    });
  };

  const hasActiveFilters = 
    filters.category !== "All" || 
    filters.priceRange !== "All" || 
    filters.scoreRange[0] !== 0 || 
    filters.scoreRange[1] !== 100 ||
    filters.distance[1] !== 10 ||
    filters.openNow ||
    filters.hasDelivery ||
    filters.hasTakeout ||
    filters.hasReservations ||
    filters.dietaryOptions.length > 0;

  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchQuery.toLowerCase());

    // Overall Score filter (new)
    const matchesScore = restaurant.overallScore >= newFilterOptions.scoreRange[0] && 
                         restaurant.overallScore <= newFilterOptions.scoreRange[1];

    // Cuisine filter (new)
    const matchesCuisine = newFilterOptions.cuisineTypes.length === 0 || 
                           newFilterOptions.cuisineTypes.includes(restaurant.cuisine);

    // Price range filter (new)
    const matchesPrice = newFilterOptions.priceRanges.length === 0 || 
                         newFilterOptions.priceRanges.includes(restaurant.priceRange);

    // City/Location filter (new)
    const matchesCity = newFilterOptions.cities.length === 0 || 
                        newFilterOptions.cities.includes(currentLocation.displayName);

    // Open now filter (new)
    const matchesOpenNow = !newFilterOptions.openNow || isRestaurantOpen(restaurant.hours);

    // Has deals filter (new)
    const matchesDeals = !newFilterOptions.hasDeals || restaurant.hasDeal;

    // LBH Component filters (advanced)
    const matchesLBH = !newFilterOptions.lbhComponents || (
      (!restaurant.lbhScore || (
        (restaurant.lbhScore.customerSentiment >= (newFilterOptions.lbhComponents.customerSentiment?.[0] || 0) &&
         restaurant.lbhScore.customerSentiment <= (newFilterOptions.lbhComponents.customerSentiment?.[1] || 100)) &&
        (restaurant.lbhScore.operationalConsistency >= (newFilterOptions.lbhComponents.operationalConsistency?.[0] || 0) &&
         restaurant.lbhScore.operationalConsistency <= (newFilterOptions.lbhComponents.operationalConsistency?.[1] || 100)) &&
        (restaurant.lbhScore.talentStability >= (newFilterOptions.lbhComponents.talentStability?.[0] || 0) &&
         restaurant.lbhScore.talentStability <= (newFilterOptions.lbhComponents.talentStability?.[1] || 100))
      )) || true
    );

    // Favorites filter
    const matchesFavorites = activeTab === "all" || favorites.includes(restaurant.id);

    return matchesSearch && matchesScore && matchesCuisine && matchesPrice && 
           matchesCity && matchesOpenNow && matchesDeals && matchesLBH && matchesFavorites;
  });

  // Sort restaurants by score (highest first)
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    return b.overallScore - a.overallScore;
  });

  const userBusiness = userBusinessId ? restaurants.find(r => r.id === userBusinessId) || null : null;

  // Restaurant of the week (highest scored restaurant)
  const restaurantOfTheWeek = [...restaurants].sort((a, b) => b.overallScore - a.overallScore)[0];

  const handleViewRestaurantDetail = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView("detail");
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setCurrentView("home");
    setSelectedRestaurant(null);
    window.scrollTo(0, 0);
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
      toast.success("Profile updated successfully!");
    }
  };

  const handleDeleteAccount = () => {
    setUser(null);
    setCurrentView("home");
    setUserBusinessId(null);
    setFavorites([]);
    setActiveTab("all");
    toast.success("Account deleted successfully");
  };

  // Handle location change
  const handleLocationChange = (location: Location) => {
    setCurrentLocation(location);
    setIsLoading(true);
    
    // Load restaurants for the new location
    const newRestaurants = getRestaurantsByLocation(location.id);
    setRestaurants(newRestaurants);
    
    // Clear favorites when changing location (or keep them - your choice)
    // setFavorites([]);
    
    // Reset to home view
    setCurrentView("home");
    setSelectedRestaurant(null);
    
    // Reset filters
    clearFilters();
    
    toast.success(`Switched to ${location.displayName}`);
    setIsLoading(false);
  };

  // Handle onboarding completion
  const handleOnboardingComplete = (preferences: {
    location: Location;
    cuisinePreferences: string[];
    claimedRestaurant?: Restaurant;
    isBusiness: boolean;
  }) => {
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
    
    // Update location
    handleLocationChange(preferences.location);
    
    // Set cuisine filter preferences
    setNewFilterOptions(prev => ({
      ...prev,
      cuisineTypes: preferences.cuisinePreferences
    }));
    
    // If business owner and claimed restaurant
    if (preferences.isBusiness && preferences.claimedRestaurant) {
      setUserBusinessId(preferences.claimedRestaurant.id);
      
      // Mark restaurant as claimed
      setRestaurants(prev => prev.map(r => 
        r.id === preferences.claimedRestaurant!.id 
          ? { ...r, claimed: true, claimedBy: user?.email }
          : r
      ));
      
      // Update user to business
      if (user && !user.isBusiness) {
        setUser({ ...user, isBusiness: true });
      }
      
      setCurrentView("dashboard");
      toast.success(`Welcome! Your restaurant has been claimed successfully!`);
    } else {
      toast.success("Setup complete! Enjoy exploring restaurants!");
    }
  };

  // Render different views
  if (currentView === "settings" && user) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          <Toaster position="top-center" richColors />
          <Header 
            user={user}
            onSignInClick={() => setShowAuthModal(true)}
            onSignOut={handleSignOut}
            onDashboardClick={handleBackToHome}
            onAddBusinessClick={handleAddBusinessClick}
            onProfileClick={() => setCurrentView("profile")}
            onSettingsClick={() => setCurrentView("settings")}
            onHelpClick={() => setCurrentView("help")}
            onLegalClick={() => setCurrentView("legal")}
            currentView={currentView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentLocation={currentLocation}
            onLocationChange={handleLocationChange}
          />
          <AccountSettings
            user={user}
            onUpdateUser={handleUpdateUser}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </ThemeProvider>
    );
  }

  if (currentView === "help") {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          <Toaster position="top-center" richColors />
          <Header 
            user={user}
            onSignInClick={() => setShowAuthModal(true)}
            onSignOut={handleSignOut}
            onDashboardClick={handleBackToHome}
            onAddBusinessClick={handleAddBusinessClick}
            onProfileClick={() => setCurrentView("profile")}
            onSettingsClick={() => setCurrentView("settings")}
            onHelpClick={() => setCurrentView("help")}
            onLegalClick={() => setCurrentView("legal")}
            currentView={currentView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentLocation={currentLocation}
            onLocationChange={handleLocationChange}
          />
          <HelpCenter />
        </div>
      </ThemeProvider>
    );
  }

  if (currentView === "legal") {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          <Toaster position="top-center" richColors />
          <Header 
            user={user}
            onSignInClick={() => setShowAuthModal(true)}
            onSignOut={handleSignOut}
            onDashboardClick={handleBackToHome}
            onAddBusinessClick={handleAddBusinessClick}
            onProfileClick={() => setCurrentView("profile")}
            onSettingsClick={() => setCurrentView("settings")}
            onHelpClick={() => setCurrentView("help")}
            onLegalClick={() => setCurrentView("legal")}
            currentView={currentView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentLocation={currentLocation}
            onLocationChange={handleLocationChange}
          />
          <LegalPages />
        </div>
      </ThemeProvider>
    );
  }

  if (currentView === "detail" && selectedRestaurant) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          <Toaster position="top-center" richColors />
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onBack={handleBackToHome}
            isFavorite={favorites.includes(selectedRestaurant.id)}
            onToggleFavorite={handleToggleFavorite}
            onAddReview={handleAddReview}
            onVoteReview={handleVoteReview}
            reviews={reviews}
            userEmail={user?.email}
            onReplyToReview={handleReplyToReview}
            isBusinessOwner={user?.isBusiness && userBusiness?.id === selectedRestaurant.id}
          />
        </div>
      </ThemeProvider>
    );
  }

  if (currentView === "map") {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          <Toaster position="top-center" richColors />
          <Header 
            user={user}
            onSignInClick={() => setShowAuthModal(true)}
            onSignOut={handleSignOut}
            onDashboardClick={handleBackToHome}
            onAddBusinessClick={handleAddBusinessClick}
            onProfileClick={() => setCurrentView("profile")}
            onSettingsClick={() => setCurrentView("settings")}
            onHelpClick={() => setCurrentView("help")}
            onLegalClick={() => setCurrentView("legal")}
            currentView={currentView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentLocation={currentLocation}
            onLocationChange={handleLocationChange}
          />
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-foreground">Map View</h2>
              <Button variant="outline" onClick={handleBackToHome}>
                Back to List
              </Button>
            </div>
            <MapView
              restaurants={sortedRestaurants}
              onRestaurantClick={handleViewRestaurantDetail}
            />
          </main>
        </div>
      </ThemeProvider>
    );
  }

  if (currentView === "comparison") {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          <Toaster position="top-center" richColors />
          <ComparisonTool
            restaurants={restaurants}
            initialRestaurants={sortedRestaurants.slice(0, 2)}
            onClose={handleBackToHome}
          />
        </div>
      </ThemeProvider>
    );
  }

  if (currentView === "profile" && user) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          <Toaster position="top-center" richColors />
          <UserProfile
            user={user}
            reviews={reviews}
            favorites={favorites}
            restaurants={restaurants}
            onClose={handleBackToHome}
            onRestaurantClick={handleViewRestaurantDetail}
          />
        </div>
      </ThemeProvider>
    );
  }

  if (currentView === "dashboard" && user?.isBusiness) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors">
          <Toaster position="top-center" richColors />
          <Header 
            user={user}
            onSignInClick={() => setShowAuthModal(true)}
            onSignOut={handleSignOut}
            onDashboardClick={handleBackToHome}
            onAddBusinessClick={handleAddBusinessClick}
            onProfileClick={() => setCurrentView("profile")}
            onSettingsClick={() => setCurrentView("settings")}
            onHelpClick={() => setCurrentView("help")}
            onLegalClick={() => setCurrentView("legal")}
            currentView={currentView}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentLocation={currentLocation}
            onLocationChange={handleLocationChange}
          />
          <BusinessDashboard 
            restaurants={restaurants}
            userBusiness={userBusiness}
            onAddBusiness={handleAddBusiness}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onViewRestaurantDetail={handleViewRestaurantDetail}
          />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors">
        <Toaster position="top-center" richColors />
        <Header 
          user={user}
          onSignInClick={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
          onDashboardClick={handleBackToHome}
          onAddBusinessClick={handleAddBusinessClick}
          onProfileClick={() => setCurrentView("profile")}
          onSettingsClick={() => setCurrentView("settings")}
          onHelpClick={() => setCurrentView("help")}
          onLegalClick={() => setCurrentView("legal")}
          currentView={currentView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentLocation={currentLocation}
          onLocationChange={handleLocationChange}
        />
        
        <AuthModal 
          open={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSignIn={handleSignIn}
        />

        {/* Onboarding Flow */}
        {showOnboarding && user && (
          <OnboardingFlow
            restaurants={restaurants}
            availableLocations={AVAILABLE_LOCATIONS}
            availableCuisines={categories.filter(c => c !== "All")}
            onComplete={handleOnboardingComplete}
            onSkip={() => {
              setShowOnboarding(false);
              setHasCompletedOnboarding(true);
              toast.info("You can always update your preferences in settings!");
            }}
            isBusiness={user.isBusiness}
          />
        )}

        {/* Add Business Dialog */}
        <Dialog open={showAddBusinessDialog} onOpenChange={setShowAddBusinessDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Your Business</DialogTitle>
              <DialogDescription>
                Join Localytics and start tracking your restaurant's performance
              </DialogDescription>
            </DialogHeader>
            <AddBusinessForm
              onSubmit={(data) => {
                handleAddBusiness(data);
              }}
            />
          </DialogContent>
        </Dialog>

        <main className="container mx-auto px-4 py-8">
          {/* Restaurant of the Week */}
          {restaurantOfTheWeek && (
            <RestaurantOfTheWeek
              restaurant={restaurantOfTheWeek}
              onViewDetails={handleViewRestaurantDetail}
            />
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-foreground mb-1">Top Rated Restaurants in {currentLocation.displayName}</h2>
                <p className="text-muted-foreground">
                  {sortedRestaurants.length} restaurant{sortedRestaurants.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DarkModeToggle />
              <Button
                variant="outline"
                onClick={() => setCurrentView("map")}
                className="gap-2"
              >
                <Map className="w-4 h-4" />
                Map View
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentView("comparison")}
                className="gap-2"
              >
                <ArrowLeftRight className="w-4 h-4" />
                Compare
              </Button>
              {user && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentView("profile")}
                  className="gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  Profile
                </Button>
              )}
              <ExportButton
                restaurants={activeTab === "favorites" ? sortedRestaurants : sortedRestaurants}
                type={activeTab === "favorites" ? "favorites" : "all"}
              />
              <FilterPanel
                filters={newFilterOptions}
                onFilterChange={setNewFilterOptions}
                availableCuisines={[...new Set(restaurants.map(r => r.cuisine))].sort()}
                availableCities={AVAILABLE_LOCATIONS.map(loc => loc.displayName)}
                showAdvanced={true}
              />
            </div>
          </div>

          {/* Tabs for All/Favorites */}
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">
                All Restaurants ({filteredRestaurants.length})
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="w-4 h-4 mr-2 fill-red-500 text-red-500" />
                Favorites ({favorites.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6 space-y-6">
              {isLoading ? (
                <>
                  <RestaurantCardSkeleton />
                  <RestaurantCardSkeleton />
                  <RestaurantCardSkeleton />
                </>
              ) : sortedRestaurants.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No restaurants found matching your criteria</p>
                  <Button 
                    onClick={() => setNewFilterOptions({
                      scoreRange: [0, 100],
                      cuisineTypes: [],
                      priceRanges: [],
                      cities: [],
                      openNow: false,
                      hasDeals: false,
                      lbhComponents: {
                        customerSentiment: [0, 100],
                        operationalConsistency: [0, 100],
                        talentStability: [0, 100]
                      }
                    })} 
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      {sortedRestaurants.map((restaurant) => (
                        <div key={restaurant.id} onClick={() => handleViewRestaurantDetail(restaurant)} className="cursor-pointer">
                          <RestaurantCard
                            restaurant={restaurant}
                            isFavorite={favorites.includes(restaurant.id)}
                            onToggleFavorite={(id) => {
                              handleToggleFavorite(id);
                            }}
                            onAddReview={handleAddReview}
                            reviews={reviews}
                            userEmail={user?.email}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-6">
                      <RecentActivity
                        activities={activities}
                        restaurants={restaurants}
                        onRestaurantClick={handleViewRestaurantDetail}
                      />
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-6 space-y-6">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-foreground mb-2">No Favorites Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start saving your favorite restaurants to see them here
                  </p>
                  {!user && (
                    <Button onClick={() => setShowAuthModal(true)}>
                      Sign In to Save Favorites
                    </Button>
                  )}
                </div>
              ) : (
                sortedRestaurants.map((restaurant) => (
                  <div key={restaurant.id} onClick={() => handleViewRestaurantDetail(restaurant)} className="cursor-pointer">
                    <RestaurantCard
                      restaurant={restaurant}
                      isFavorite={true}
                      onToggleFavorite={handleToggleFavorite}
                      onAddReview={handleAddReview}
                      reviews={reviews}
                      userEmail={user?.email}
                    />
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ThemeProvider>
  );
}