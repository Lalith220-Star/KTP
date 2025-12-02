import { Restaurant } from '../types/restaurant';

/**
 * Convert UUID to a simple numeric ID for frontend compatibility
 * Uses a basic hash of the UUID string
 */
function uuidToNumericId(uuid: string): number {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Maps backend restaurant data from Supabase to frontend Restaurant type
 */
export function mapBackendRestaurant(backendData: any): Restaurant {
  const {
    id,
    name,
    address,
    city,
    state,
    cuisine,
    price_level,
    phone,
    website,
    lat,
    lng,
    rating,
    lbh_scores,
  } = backendData;

  // Calculate overall score from LBH if available, otherwise use rating * 20
  const overallScore = lbh_scores?.lbh 
    ? Math.round(lbh_scores.lbh) 
    : Math.round((rating || 4.5) * 20);

  // Map price level (1-4) to $ signs
  const priceRange = price_level 
    ? '$'.repeat(Math.min(price_level, 4))
    : '$$';

  // Create factor scores from LBH components
  const factors = lbh_scores ? [
    { 
      name: "Customer Sentiment", 
      score: Math.round(lbh_scores.sentiment_score || 0), 
      weight: 40 
    },
    { 
      name: "Operational Consistency", 
      score: Math.round(lbh_scores.consistency_score || 0), 
      weight: 30 
    },
    { 
      name: "Talent Stability", 
      score: Math.round(lbh_scores.stability_score || 0), 
      weight: 30 
    },
  ] : [
    { name: "Food Quality", score: 85, weight: 30 },
    { name: "Service", score: 80, weight: 25 },
    { name: "Ambiance", score: 75, weight: 15 },
    { name: "Value for Money", score: 85, weight: 15 },
    { name: "Cleanliness", score: 90, weight: 10 },
    { name: "Location", score: 80, weight: 5 },
  ];

  // Default placeholder image if none provided
  const image = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400";

  return {
    id: uuidToNumericId(id),
    backendId: id, // Store UUID for API calls
    name: name || 'Unknown Restaurant',
    cuisine: cuisine || 'Restaurant',
    address: address || `${city}, ${state}`,
    priceRange,
    distance: "N/A", // We don't have user location to calculate this
    image,
    overallScore,
    factors,
    phone: phone || undefined,
    website: website || undefined,
    coordinates: (lat && lng) ? {
      lat: Number(lat),
      lng: Number(lng)
    } : undefined,
    photos: [image], // Backend doesn't have multiple photos yet
    hours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "11:00 AM - 9:00 PM",
    },
    dietaryOptions: [],
    hasDelivery: false,
    hasTakeout: true,
    description: `${cuisine || 'Restaurant'} in ${city}, ${state}`,
  };
}

/**
 * Maps backend review data to frontend format
 * Can handle reviews from both raw_reviews table (with restaurant_id) and get-restaurant endpoint (without)
 */
export function mapBackendReview(backendReview: any, fallbackRestaurantId?: string) {
  const restaurantUuid = backendReview.restaurant_id || fallbackRestaurantId;
  
  return {
    id: backendReview.id || `review-${Date.now()}-${Math.random()}`,
    restaurantId: restaurantUuid ? uuidToNumericId(restaurantUuid) : 0,
    userEmail: backendReview.author || 'Anonymous',
    rating: backendReview.rating,
    comment: backendReview.text || '',
    date: backendReview.created_at,
    helpfulVotes: 0,
    votedBy: [],
  };
}
