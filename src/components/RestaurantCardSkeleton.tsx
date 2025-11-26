import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function RestaurantCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <Skeleton className="md:w-64 h-48 md:h-auto" />
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="w-16 h-16 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </Card>
  );
}
