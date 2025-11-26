import { useState } from "react";
import { Restaurant, Review } from "../types/restaurant";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ReviewDialog } from "./ReviewDialog";
import { LBHScoreGauge } from "./LBHScoreGauge";
import { LBHScoreExplainer } from "./LBHScoreExplainer";
import { CompetitiveBenchmarkChart } from "./CompetitiveBenchmarkChart";
import { ReviewWordCloud } from "./ReviewWordCloud";
import { 
  MapPin, Phone, Globe, Clock, DollarSign, Heart, Share2, 
  ChevronLeft, Star, ThumbsUp, MessageSquare, Calendar,
  Utensils, Truck, ShoppingBag, Tag, ExternalLink, Award, BarChart3, Users, TrendingUp
} from "lucide-react";
import { isRestaurantOpen, getCurrentDayHours, formatDate } from "../utils/timeUtils";
import { toast } from "sonner@2.0.3";

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (restaurantId: number) => void;
  onAddReview?: (restaurantId: number, rating: number, comment: string) => void;
  onVoteReview?: (reviewId: string, helpful: boolean) => void;
  reviews?: Review[];
  userEmail?: string | null;
  onReplyToReview?: (reviewId: string, reply: string) => void;
  isBusinessOwner?: boolean;
}

export function RestaurantDetail({
  restaurant,
  onBack,
  isFavorite = false,
  onToggleFavorite,
  onAddReview,
  onVoteReview,
  reviews = [],
  userEmail,
  onReplyToReview,
  isBusinessOwner = false
}: RestaurantDetailProps) {
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const restaurantReviews = reviews.filter(r => r.restaurantId === restaurant.id);
  const userHasReviewed = restaurantReviews.some(r => r.userEmail === userEmail);
  const averageUserRating = restaurantReviews.length > 0
    ? (restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length).toFixed(1)
    : null;

  const isOpen = isRestaurantOpen(restaurant.hours);
  const todayHours = getCurrentDayHours(restaurant.hours);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-blue-700 bg-blue-100 border-blue-300";
    if (score >= 75) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 60) return "text-gray-700 bg-gray-100 border-gray-300";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: `Check out ${restaurant.name} on Localytics!`,
          url: url
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleReply = (reviewId: string) => {
    if (replyText.trim() && onReplyToReview) {
      onReplyToReview(reviewId, replyText);
      setReplyingTo(null);
      setReplyText("");
      toast.success("Reply posted successfully!");
    }
  };

  const allPhotos = [restaurant.image, ...(restaurant.photos || [])];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="outline" onClick={onBack} className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-950">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 h-96 md:h-[500px] bg-muted rounded-lg overflow-hidden">
              <ImageWithFallback
                src={allPhotos[selectedImage]}
                alt={restaurant.name}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
              />
            </div>
            <div className="grid grid-cols-4 md:grid-cols-1 gap-2">
              {allPhotos.slice(0, 4).map((photo, index) => (
                <div
                  key={index}
                  className={`h-24 md:h-28 bg-muted rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedImage === index ? "border-blue-600 dark:border-blue-400" : "border-transparent"
                  } hover:border-blue-400 transition`}
                  onClick={() => setSelectedImage(index)}
                >
                  <ImageWithFallback
                    src={photo}
                    alt={`${restaurant.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurant Info */}
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-foreground">{restaurant.name}</h1>
                    {restaurant.claimed && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-2">
                    <Badge variant="outline">{restaurant.cuisine}</Badge>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {restaurant.priceRange}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {restaurant.distance}
                    </span>
                    {averageUserRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{averageUserRating} ({restaurantReviews.length})</span>
                      </div>
                    )}
                  </div>
                  {restaurant.description && (
                    <p className="text-muted-foreground mt-3">{restaurant.description}</p>
                  )}
                </div>
                <div className={`text-4xl border-2 rounded-lg px-4 py-2 ${getScoreColor(restaurant.overallScore)}`}>
                  {restaurant.overallScore}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {userEmail && onAddReview && (
                  <Button
                    onClick={() => setShowReviewDialog(true)}
                    disabled={userHasReviewed}
                    className="flex-1"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {userHasReviewed ? "You reviewed this" : "Write a Review"}
                  </Button>
                )}
                {onToggleFavorite && (
                  <Button
                    variant="outline"
                    onClick={() => onToggleFavorite(restaurant.id)}
                    className="gap-2"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                )}
                <Button variant="outline" onClick={handleShare} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h3 className="text-foreground mb-4">Features & Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {restaurant.hasDelivery && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Delivery</span>
                  </div>
                )}
                {restaurant.hasTakeout && (
                  <div className="flex items-center gap-2 text-foreground">
                    <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Takeout</span>
                  </div>
                )}
                {restaurant.reservationLink && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>Reservations</span>
                  </div>
                )}
                {restaurant.dietaryOptions?.map((option) => (
                  <div key={option} className="flex items-center gap-2 text-foreground">
                    <Utensils className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Deals */}
            {restaurant.deals && restaurant.deals.length > 0 && (
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/30 dark:to-background border-blue-200 dark:border-blue-900">
                <h3 className="text-foreground mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Current Deals & Specials
                </h3>
                <div className="space-y-3">
                  {restaurant.deals.map((deal) => (
                    <div key={deal.id} className="bg-white dark:bg-card p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-foreground mb-1">{deal.title}</h4>
                          <p className="text-sm text-muted-foreground">{deal.description}</p>
                        </div>
                        {deal.discountPercent && (
                          <Badge className="bg-blue-600">{deal.discountPercent}% OFF</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Valid until {new Date(deal.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tabs: Score Breakdown, Reviews, Hours */}
            <Card className="p-6">
              <Tabs defaultValue="scores" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="scores">Score Breakdown</TabsTrigger>
                  <TabsTrigger value="reviews">
                    Reviews ({restaurantReviews.length})
                  </TabsTrigger>
                  <TabsTrigger value="hours">Hours</TabsTrigger>
                </TabsList>

                <TabsContent value="scores" className="space-y-6 pt-4">
                  {/* LBH Score Gauge */}
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      <LBHScoreGauge
                        score={restaurant.overallScore}
                        showBreakdown={true}
                        customerSentiment={Math.round((restaurant.factors[0]?.score || 85) * 0.4 + (restaurant.factors[1]?.score || 85) * 0.3 + (restaurant.factors[2]?.score || 85) * 0.3)}
                        operationalConsistency={Math.round((restaurant.factors[3]?.score || 85) * 0.5 + (restaurant.factors[4]?.score || 85) * 0.5)}
                        talentStability={Math.round((restaurant.factors[5]?.score || 85) * 0.6 + (restaurant.factors[1]?.score || 85) * 0.4)}
                      />
                    </div>
                  </div>

                  {/* LBH Explanation */}
                  <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-foreground flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Understanding the LBH Score
                      </h3>
                      <LBHScoreExplainer score={restaurant.overallScore} factors={restaurant.factors} />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-sm text-foreground mb-1">Customer Sentiment</h4>
                          <p className="text-xs text-muted-foreground">
                            Review analysis & satisfaction trends from food quality, service, and ambiance
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-sm text-foreground mb-1">Operational Consistency</h4>
                          <p className="text-xs text-muted-foreground">
                            Business hours reliability, value for money, and cleanliness standards
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-sm text-foreground mb-1">Talent Stability</h4>
                          <p className="text-xs text-muted-foreground">
                            Staff retention indicators and service consistency from location factors
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Competitive Benchmarking */}
                  <CompetitiveBenchmarkChart
                    data={[
                      {
                        label: "Customer Sentiment",
                        yourScore: Math.round((restaurant.factors[0]?.score || 85) * 0.4 + (restaurant.factors[1]?.score || 85) * 0.3 + (restaurant.factors[2]?.score || 85) * 0.3),
                        localAverage: 72,
                        topCompetitor: 88
                      },
                      {
                        label: "Operational Consistency",
                        yourScore: Math.round((restaurant.factors[3]?.score || 85) * 0.5 + (restaurant.factors[4]?.score || 85) * 0.5),
                        localAverage: 75,
                        topCompetitor: 91
                      },
                      {
                        label: "Talent Stability",
                        yourScore: Math.round((restaurant.factors[5]?.score || 85) * 0.6 + (restaurant.factors[1]?.score || 85) * 0.4),
                        localAverage: 68,
                        topCompetitor: 85
                      }
                    ]}
                  />

                  {/* Individual Factor Scores */}
                  <Card className="p-6">
                    <h3 className="text-foreground mb-4">Detailed Factor Breakdown</h3>
                    <div className="space-y-4">
                      {restaurant.factors.map((factor, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-foreground">{factor.name}</span>
                            <span className="text-foreground">{factor.score}/100</span>
                          </div>
                          <Progress value={factor.score} className="h-3" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4 pt-4">
                  {/* Review Word Cloud */}
                  {restaurantReviews.length > 0 && (
                    <ReviewWordCloud reviews={restaurantReviews} />
                  )}

                  {restaurantReviews.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                      <p>No reviews yet. Be the first to review!</p>
                    </div>
                  ) : (
                    restaurantReviews.map((review) => (
                      <div key={review.id} className="bg-muted/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-foreground">
                                {review.userName || review.userEmail}
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(review.date)}
                            </span>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-foreground">{review.comment}</p>
                        )}
                        
                        {/* Review Actions */}
                        <div className="flex items-center gap-4 pt-2">
                          {onVoteReview && (
                            <button
                              onClick={() => onVoteReview(review.id, true)}
                              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-blue-600 transition"
                              disabled={review.votedBy?.includes(userEmail || "")}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>Helpful ({review.helpfulVotes || 0})</span>
                            </button>
                          )}
                          {isBusinessOwner && !review.response && (
                            <button
                              onClick={() => setReplyingTo(review.id)}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              Reply
                            </button>
                          )}
                        </div>

                        {/* Owner Reply */}
                        {review.response && (
                          <div className="ml-6 mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                Owner Response
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(review.response.date)}
                              </span>
                            </div>
                            <p className="text-sm text-foreground">{review.response.text}</p>
                          </div>
                        )}

                        {/* Reply Form */}
                        {replyingTo === review.id && (
                          <div className="ml-6 mt-3 space-y-2">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your reply..."
                              className="w-full p-3 border rounded-lg resize-none"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleReply(review.id)}>
                                Post Reply
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="hours" className="pt-4">
                  {restaurant.hours ? (
                    <div className="space-y-2">
                      {Object.entries(restaurant.hours).map(([day, hours]) => (
                        <div
                          key={day}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <span className="capitalize text-muted-foreground">{day}</span>
                          <span className="text-foreground">{hours}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Hours not available</p>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-6">
            {/* Status & Hours */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">Current Status</span>
                  </div>
                  <Badge className={isOpen ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}>
                    {isOpen ? "Open Now" : "Closed"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{todayHours}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">Address</span>
                  </div>
                  <p className="text-foreground">{restaurant.address}</p>
                  <Button variant="link" className="p-0 h-auto mt-1" asChild>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(restaurant.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 flex items-center gap-1"
                    >
                      Get Directions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>

                {restaurant.phone && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">Phone</span>
                      </div>
                      <a
                        href={`tel:${restaurant.phone}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {restaurant.phone}
                      </a>
                    </div>
                  </>
                )}

                {restaurant.website && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">Website</span>
                      </div>
                      <a
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </>
                )}

                {restaurant.reservationLink && (
                  <>
                    <Separator />
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <a
                        href={restaurant.reservationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Make a Reservation
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Menu Preview */}
            {restaurant.menuPreview && (
              <Card className="p-6">
                <h3 className="text-foreground mb-2">Menu Highlights</h3>
                <p className="text-foreground">{restaurant.menuPreview}</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      {userEmail && onAddReview && (
        <ReviewDialog
          open={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
          onSubmit={(rating, comment) => {
            onAddReview(restaurant.id, rating, comment);
            setShowReviewDialog(false);
          }}
          restaurantName={restaurant.name}
        />
      )}
    </div>
  );
}