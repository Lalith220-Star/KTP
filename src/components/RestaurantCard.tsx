import { MapPin, DollarSign, Clock, ChevronDown, ChevronUp, Heart, Star, MessageSquare } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ReviewDialog } from "./ReviewDialog";
import { useState } from "react";
import { Separator } from "./ui/separator";

interface ScoreFactor {
  name: string;
  score: number;
  weight: number;
}

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  address: string;
  priceRange: string;
  distance: string;
  image: string;
  overallScore: number;
  factors: ScoreFactor[];
}

export interface Review {
  id: string;
  restaurantId: number;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  isFavorite?: boolean;
  onToggleFavorite?: (restaurantId: number) => void;
  onAddReview?: (restaurantId: number, rating: number, comment: string) => void;
  reviews?: Review[];
  userEmail?: string | null;
}

export function RestaurantCard({ 
  restaurant, 
  isFavorite = false, 
  onToggleFavorite, 
  onAddReview,
  reviews = [],
  userEmail
}: RestaurantCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const restaurantReviews = reviews.filter(r => r.restaurantId === restaurant.id);
  const userHasReviewed = restaurantReviews.some(r => r.userEmail === userEmail);
  const averageUserRating = restaurantReviews.length > 0
    ? (restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length).toFixed(1)
    : null;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700";
    if (score >= 75) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    if (score >= 60) return "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600";
    return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700";
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Exceptional";
    if (score >= 75) return "Great";
    if (score >= 60) return "Good";
    return "Fair";
  };

  const handleAddReview = (rating: number, comment: string) => {
    if (onAddReview) {
      onAddReview(restaurant.id, rating, comment);
    }
  };

  const displayedReviews = showAllReviews ? restaurantReviews : restaurantReviews.slice(0, 3);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 h-48 md:h-auto relative overflow-hidden bg-gray-100 dark:bg-gray-800">
            <ImageWithFallback 
              src={restaurant.image} 
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-foreground">
                {restaurant.cuisine}
              </Badge>
            </div>
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(restaurant.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all hover:scale-110"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  }`}
                />
              </button>
            )}
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-foreground mb-2">{restaurant.name}</h3>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{restaurant.priceRange}</span>
                  </div>
                  {averageUserRating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{averageUserRating} ({restaurantReviews.length} {restaurantReviews.length === 1 ? 'review' : 'reviews'})</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">{restaurant.address}</p>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className={`text-4xl border-2 rounded-lg px-4 py-2 ${getScoreColor(restaurant.overallScore)}`}>
                  {restaurant.overallScore}
                </div>
                <span className="text-xs text-muted-foreground">LBH Score</span>
                <span className="text-xs text-muted-foreground">{getScoreLabel(restaurant.overallScore)}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {userEmail && onAddReview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReviewDialog(true)}
                  disabled={userHasReviewed}
                  className="flex-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  {userHasReviewed ? "You reviewed this" : "Write a Review"}
                </Button>
              )}
            </div>
            
            <Button
              variant="ghost"
              className="w-full mt-2 justify-between"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              <span>{showBreakdown ? "Hide" : "View"} Score Breakdown</span>
              {showBreakdown ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
            
            {showBreakdown && (
              <div className="mt-4 pt-4 border-t">
                <ScoreBreakdown factors={restaurant.factors} />
              </div>
            )}

            {restaurantReviews.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="mb-3 text-foreground">User Reviews</h4>
                <div className="space-y-4">
                  {displayedReviews.map((review) => (
                    <div key={review.id} className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-foreground">{review.userEmail}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
                {restaurantReviews.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="w-full mt-2"
                  >
                    {showAllReviews ? "Show Less" : `Show ${restaurantReviews.length - 3} More Reviews`}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {userEmail && onAddReview && (
        <ReviewDialog
          open={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
          onSubmit={handleAddReview}
          restaurantName={restaurant.name}
        />
      )}
    </>
  );
}
