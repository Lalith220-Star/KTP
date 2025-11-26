import { UserActivity, Restaurant } from "../types/restaurant";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Heart, Plus } from "lucide-react";
import { formatDate } from "../utils/timeUtils";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RecentActivityProps {
  activities: UserActivity[];
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
}

export function RecentActivity({ activities, restaurants, onRestaurantClick }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "review":
        return <Star className="w-5 h-5 text-yellow-500" />;
      case "favorite":
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case "new_restaurant":
        return <Plus className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getActivityText = (activity: UserActivity) => {
    const userName = activity.userName || activity.userEmail.split("@")[0];
    switch (activity.type) {
      case "review":
        return (
          <>
            <strong>{userName}</strong> reviewed{" "}
            <strong>{activity.restaurantName}</strong>
          </>
        );
      case "favorite":
        return (
          <>
            <strong>{userName}</strong> saved{" "}
            <strong>{activity.restaurantName}</strong>
          </>
        );
      case "new_restaurant":
        return (
          <>
            <strong>{activity.restaurantName}</strong> was added to Localytics
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-foreground dark:text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground dark:text-muted-foreground py-8">No recent activity</p>
        ) : (
          activities.map((activity) => {
            const restaurant = activity.restaurantId
              ? restaurants.find((r) => r.id === activity.restaurantId)
              : null;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b last:border-0 hover:bg-gray-50 p-3 rounded-lg transition cursor-pointer"
                onClick={() => restaurant && onRestaurantClick(restaurant)}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground dark:text-foreground mb-1">{getActivityText(activity)}</p>
                  {activity.type === "review" && activity.rating && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < activity.rating!
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {activity.content && (
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground line-clamp-2">{activity.content}</p>
                  )}
                  <span className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 block">
                    {formatDate(activity.date)}
                  </span>
                </div>
                {restaurant && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}