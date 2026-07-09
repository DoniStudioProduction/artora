export interface Product {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  secondaryImageUrl?: string;
  description: string;
  materials: string[];
  dimensions: string;
  inStock: number;
  views?: number;
  status?: "Published" | "Draft" | "Paused";
  images?: string[];
  videoUrl?: string;
  processingTime?: string;
  currency?: string;
  quantity?: number;
  creatorCountry?: string;
  creatorStoryText?: string;
  inspiration?: string;
  productionTime?: string;
  storyText?: string;
  weight?: number;
  shippingTime?: number;
  careInstructions?: string;
  tags?: string[];
}

export interface Creator {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  bio: string;
  location: string;
  followersCount: number;
  featuredWorks: string[];
  isFollowing?: boolean;
}

export interface CreatorStory {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  readTime: string;
  imageUrl: string;
  summary: string;
  fullStory: string;
  publishedDate: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
