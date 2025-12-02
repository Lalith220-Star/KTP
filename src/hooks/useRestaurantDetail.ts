import { useState, useEffect } from 'react';
import { getRestaurant } from '../utils/api';
import { mapBackendReview } from '../utils/dataMappers';

export function useRestaurantDetail(restaurantId: string | null) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!restaurantId) {
      setReviews([]);
      return;
    }

    let isMounted = true;

    async function fetchRestaurantDetail() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getRestaurant(restaurantId);

        if (isMounted && response.reviews) {
          const mappedReviews = response.reviews.map((r: any) => 
            mapBackendReview(r, restaurantId)
          );
          setReviews(mappedReviews);
        }
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load reviews');
          setReviews([]); // Fallback to empty
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRestaurantDetail();

    return () => {
      isMounted = false;
    };
  }, [restaurantId]);

  return { reviews, loading, error };
}
