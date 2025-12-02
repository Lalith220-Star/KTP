import { useState, useEffect } from 'react';
import { getRestaurants } from '../utils/api';
import { mapBackendRestaurant } from '../utils/dataMappers';
import { Restaurant } from '../types/restaurant';

export function useRestaurants(filters: {
  city?: string;
  cuisine?: string;
  min_lbh?: number;
  limit?: number;
  offset?: number;
} = {}) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRestaurants() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getRestaurants({
          limit: 100,
          ...filters,
        });

        if (isMounted) {
          const mappedRestaurants = response.restaurants.map(mapBackendRestaurant);
          setRestaurants(mappedRestaurants);
        }
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load restaurants');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRestaurants();

    return () => {
      isMounted = false;
    };
  }, [filters.city, filters.cuisine, filters.min_lbh, filters.limit, filters.offset]);

  return { restaurants, loading, error, refetch: () => {} };
}
