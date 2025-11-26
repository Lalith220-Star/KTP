import { Restaurant, Review, User } from "../types/restaurant";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Star, Heart, MessageSquare, Calendar, TrendingUp, Award } from "lucide-react";
import { formatDate } from "../utils/timeUtils";

interface UserProfileProps {
  user: User;
  reviews: Review[];
  favorites: number[];
  restaurants: Restaurant[];
  onClose: () => void;
  onRestaurantClick: (restaurant: Restaurant) => void;
}

export function UserProfile({
  user,
  reviews,
  favorites,
  restaurants,
  onClose,
  onRestaurantClick
}: UserProfileProps) {
  const userReviews = reviews.filter(r => r.userEmail === user.email);
  const favoriteRestaurants = restaurants.filter(r => favorites.includes(r.id));
  
  const totalReviews = userReviews.length;
  const averageRating = totalReviews > 0
    ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0";
  const totalHelpfulVotes = userReviews.reduce((sum, r) => sum + (r.helpfulVotes || 0), 0);

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const memberSince = user.memberSince || "November 2024";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-foreground dark:text-foreground">User Profile</h2>
          <Button variant="outline" onClick={onClose}>
            Back
          </Button>
        </div>

        {/* Profile Info */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`} />
              <AvatarFallback>{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-foreground dark:text-foreground mb-1">{user.name || user.email}</h3>
              <p className="text-muted-foreground dark:text-muted-foreground mb-3">{user.email}</p>
              {user.bio && (
                <p className="text-foreground dark:text-foreground mb-3">{user.bio}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {memberSince}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-3xl text-foreground dark:text-foreground">{totalReviews}</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Reviews</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span className="text-3xl text-foreground dark:text-foreground">{averageRating}</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Avg Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-3xl text-foreground dark:text-foreground">{totalHelpfulVotes}</span>
              </div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground">Helpful Votes</p>
            </div>
          </div>
        </Card>

        {/* Reviews Section */}
        <Card className="p-6 mb-6">
          <h3 className="text-foreground dark:text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Your Reviews ({totalReviews})
          </h3>
          {userReviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground dark:text-muted-foreground">
              <p>You haven't written any reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userReviews.slice(0, 10).map((review) => {
                const restaurant = restaurants.find(r => r.id === review.restaurantId);
                if (!restaurant) return null;
                
                return (
                  <div
                    key={review.id}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                    onClick={() => onRestaurantClick(restaurant)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-foreground dark:text-foreground mb-1">{restaurant.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                      {review.helpfulVotes > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {review.helpfulVotes} helpful
                        </Badge>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-foreground dark:text-foreground">{review.comment}</p>
                    )}
                    {review.response && (
                      <div className="mt-2 pl-4 border-l-2 border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Owner Response</p>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">{review.response.text}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Favorites Section */}
        <Card className="p-6">
          <h3 className="text-foreground dark:text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            Your Favorites ({favoriteRestaurants.length})
          </h3>
          {favoriteRestaurants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground dark:text-muted-foreground">
              <p>You haven't saved any favorites yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                  onClick={() => onRestaurantClick(restaurant)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-foreground dark:text-foreground">{restaurant.name}</h4>
                    <Badge className="bg-blue-600">{restaurant.overallScore}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-muted-foreground">
                    <Badge variant="outline">{restaurant.cuisine}</Badge>
                    <span>{restaurant.priceRange}</span>
                    <span>• {restaurant.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Achievements (optional fun feature) */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <h3 className="text-foreground dark:text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {totalReviews >= 1 && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm text-foreground dark:text-foreground">First Review</p>
              </div>
            )}
            {totalReviews >= 5 && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-sm text-foreground dark:text-foreground">Review Pro</p>
              </div>
            )}
            {totalHelpfulVotes >= 10 && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-foreground dark:text-foreground">Helpful Reviewer</p>
              </div>
            )}
            {favoriteRestaurants.length >= 5 && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-sm text-foreground dark:text-foreground">Foodie Explorer</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}