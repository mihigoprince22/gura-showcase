export interface ListingRow {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  description: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'parts_only';
  price: string; // BIGINT usually fetched as string in pg
  currency: string;
  listing_format: 'fixed' | 'auction' | 'auction_bin';
  buy_now_price: string | null;
  starting_bid: string | null;
  reserve_price: string | null;
  current_bid: string | null;
  bid_count: number;
  auction_end: Date | null;
  images: string[];
  shipping_options: any; // JSONB
  location_district: string | null;
  location_city: string | null;
  status: 'draft' | 'active' | 'sold' | 'ended' | 'moderation_hold';
  view_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateListingInput {
  category_id: string;
  title: string;
  description: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'parts_only';
  price: number;
  listing_format?: 'fixed' | 'auction' | 'auction_bin';
  buy_now_price?: number;
  starting_bid?: number;
  reserve_price?: number;
  auction_end?: Date;
  images: string[]; // Can be base64 strings
  shipping_options?: any;
  location_district?: string;
  location_city?: string;
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  condition?: 'new' | 'like_new' | 'good' | 'fair' | 'parts_only';
  price?: number;
  listing_format?: 'fixed' | 'auction' | 'auction_bin';
  buy_now_price?: number;
  starting_bid?: number;
  reserve_price?: number;
  auction_end?: Date;
  images?: string[];
  shipping_options?: any;
  location_district?: string;
  location_city?: string;
  status?: 'draft' | 'active' | 'sold' | 'ended' | 'moderation_hold';
}
