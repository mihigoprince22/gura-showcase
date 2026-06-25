import { uploadImage } from '../../services/cloudinary.service.js';
import * as listingsRepo from './listings.repository.js';
import type { CreateListingInput, UpdateListingInput, ListingRow } from './listings.types.js';
import { queryOne } from '../../config/database.js';

export async function createListing(sellerId: string, input: CreateListingInput): Promise<ListingRow> {
  // 1. Validation
  if (input.listing_format === 'auction' || input.listing_format === 'auction_bin') {
    if (!input.starting_bid) {
      throw new Error('Starting bid is required for auctions');
    }
    if (!input.auction_end) {
      throw new Error('Auction end date is required for auctions');
    }
    const endTime = new Date(input.auction_end).getTime();
    if (isNaN(endTime) || endTime <= Date.now()) {
      throw new Error('Auction end must be in the future');
    }
  }

  // 2. Upload images to Cloudinary
  const uploadedImages: string[] = [];
  if (input.images && input.images.length > 0) {
    for (const img of input.images) {
      // Very basic check if it's base64 or URL
      if (img.startsWith('data:image') || img.length > 1000) {
        const url = await uploadImage(img);
        uploadedImages.push(url);
      } else {
        // Assume it's already a URL
        uploadedImages.push(img);
      }
    }
  }

  // 3. Create listing
  return listingsRepo.createListing(sellerId, {
    ...input,
    uploaded_images: uploadedImages
  });
}

export async function updateListing(
  listingId: string,
  sellerId: string,
  input: UpdateListingInput
): Promise<ListingRow | null> {
  // If images are provided, handle new uploads
  const uploadedImages: string[] = [];
  if (input.images && input.images.length > 0) {
    for (const img of input.images) {
      if (img.startsWith('data:image') || img.length > 1000) {
        const url = await uploadImage(img);
        uploadedImages.push(url);
      } else {
        uploadedImages.push(img);
      }
    }
    input.images = uploadedImages;
  }

  const updated = await listingsRepo.updateListing(listingId, sellerId, input);
  return updated;
}

export async function getListingById(id: string) {
  const sql = `
    SELECT l.*, c.name as category_name
    FROM listings l
    LEFT JOIN categories c ON l.category_id = c.id
    WHERE l.id = $1
  `;
  return queryOne(sql, [id]);
}

export async function getPriceIntelligence(categoryId?: string, keywords?: string) {
  let sql = `
    SELECT 
      percentile_cont(0.5) WITHIN GROUP (ORDER BY o.amount) as median,
      min(o.amount) as min_sold, 
      max(o.amount) as max_sold, 
      count(*) as sold_count
    FROM orders o
    JOIN listings l ON l.id = o.listing_id
    WHERE o.status = 'complete'
      AND o.created_at > now() - interval '90 days'
  `;
  const params: any[] = [];
  let paramIdx = 1;

  if (categoryId) {
    sql += ` AND l.category_id = $${paramIdx}`;
    params.push(categoryId);
    paramIdx++;
  }

  if (keywords) {
    sql += ` AND l.title ILIKE $${paramIdx}`;
    params.push(`%${keywords}%`);
    paramIdx++;
  }

  return queryOne(sql, params);
}

export async function listListings(filters: {
  category_id?: string;
  seller_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  return listingsRepo.listListings(filters);
}
