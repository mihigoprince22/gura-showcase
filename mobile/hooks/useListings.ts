import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  format: 'fixed' | 'auction';
  condition: string;
  category_id: string;
  category_name?: string;
  location_district: string;
  location_city?: string;
  images: string[];
  photos?: string[];
  seller_id: string;
  seller_name: string;
  seller_avatar?: string;
  seller_rating: number;
  created_at: string;
  status: string;
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
}

export const useListings = () => {
  return useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const res = await api.get<any>('/listings');
      const items = res.data?.data?.listings || res.data?.listings || [];
      return items.map((l: any) => ({
        ...l,
        photos: l.images || [],
        district: l.location_district,
        format: l.listing_type,
        category: l.category_name || l.category_id,
        seller: {
          id: l.seller_id,
          name: l.seller_name || 'Seller',
          rating: l.seller_rating || 5.0,
        }
      }));
    },
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const res = await api.get<any>(`/listings/${id}`);
      const l = res.data?.data || res.data;
      if (!l) throw new Error('Listing not found');
      return {
        ...l,
        photos: l.images || [],
        district: l.location_district,
        format: l.listing_type,
        category: l.category_name || l.category_id,
        seller: {
          id: l.seller_id,
          name: l.seller_name || 'Seller',
          rating: l.seller_rating || 5.0,
        }
      };
    },
    enabled: !!id,
  });
};

export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newListing: any) => {
      // Map local form state to backend API fields
      const payload = {
        title: newListing.title,
        description: newListing.description,
        price: newListing.price,
        currency: 'RWF',
        category_name: newListing.category,
        condition: newListing.condition,
        listing_type: newListing.format.toLowerCase(),
        images: newListing.photos,
        location_district: newListing.district,
      };
      
      const res = await api.post<any>('/listings', payload);
      const l = res.data?.data || res.data;
      return {
        ...l,
        photos: l.images || [],
        district: l.location_district,
        format: l.listing_type,
        category: l.category_name || l.category_id,
      };
    },
    onSuccess: () => {
      // Invalidate both listings and feed
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};
