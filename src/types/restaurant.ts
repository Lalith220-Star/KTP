export interface ScoreFactor {
  name: string;
  score: number;
  weight: number;
}

export interface Review {
  id: string;
  restaurantId: number;
  userEmail: string;
  userName?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulVotes: number;
  votedBy: string[];
  response?: {
    text: string;
    date: string;
    ownerName: string;
  };
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  discountPercent?: number;
}

export interface Hours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface ScoreHistory {
  date: string;
  overallScore: number;
  factors: ScoreFactor[];
}

export interface Restaurant {
  id: number;
  backendId?: string; // UUID from backend for API calls
  name: string;
  cuisine: string;
  address: string;
  priceRange: string;
  distance: string;
  image: string;
  overallScore: number;
  factors: ScoreFactor[];
  phone?: string;
  website?: string;
  coordinates?: { lat: number; lng: number };
  photos?: string[];
  hours?: Hours;
  dietaryOptions?: string[];
  hasDelivery?: boolean;
  hasTakeout?: boolean;
  menuPreview?: string;
  reservationLink?: string;
  deals?: Deal[];
  description?: string;
  claimed?: boolean;
  claimedBy?: string;
  scoreHistory?: ScoreHistory[];
}

export interface User {
  email: string;
  isBusiness: boolean;
  name?: string;
  avatar?: string;
  memberSince?: string;
  bio?: string;
  watchlist?: number[]; // Array of restaurant IDs
}

export interface UserActivity {
  id: string;
  type: 'review' | 'favorite' | 'new_restaurant';
  userEmail: string;
  userName?: string;
  restaurantId?: number;
  restaurantName?: string;
  content?: string;
  rating?: number;
  date: string;
}
