export interface SearchQueryInput {
  q?: string;
  category_id?: string;
  condition?: string;
  listing_format?: string;
  location_district?: string;
  seller_tier?: string;
  price_min?: number;
  price_max?: number;
  free_shipping?: boolean;
  page?: number;
  per_page?: number;
}

export interface SearchResultItem {
  id: string;
  title: string;
  price: number;
  condition: string;
  listing_format: string;
  location_district: string;
  seller_tier: string;
  images: string[];
}

export interface SearchResponse {
  found: number;
  page: number;
  hits: SearchResultItem[];
}
