import { query, queryOne } from '../../config/database.js';
import type { ListingRow, CreateListingInput, UpdateListingInput } from './listings.types.js';

export async function createListing(
  sellerId: string,
  input: CreateListingInput & { uploaded_images: string[] }
): Promise<ListingRow> {
  const result = await queryOne<ListingRow>(
    `INSERT INTO listings (
      seller_id,
      category_id,
      title,
      description,
      condition,
      price,
      listing_format,
      buy_now_price,
      starting_bid,
      reserve_price,
      auction_end,
      images,
      shipping_options,
      location_district,
      location_city,
      status
    ) VALUES (
      $1, $2, $3, $4, $5::condition_enum, $6, $7::listing_format_enum,
      $8, $9, $10, $11, $12, $13, $14, $15, $16::listing_status_enum
    ) RETURNING *`,
    [
      sellerId,
      input.category_id,
      input.title,
      input.description,
      input.condition,
      input.price,
      input.listing_format || 'fixed',
      input.buy_now_price || null,
      input.starting_bid || null,
      input.reserve_price || null,
      input.auction_end || null,
      input.uploaded_images,
      input.shipping_options ? JSON.stringify(input.shipping_options) : '[]',
      input.location_district || null,
      input.location_city || null,
      'active' // defaulting to active immediately for simplicity, or could be 'draft'
    ]
  );
  if (!result) {
    throw new Error('Failed to create listing');
  }
  return result;
}

export async function getListingById(id: string): Promise<ListingRow | null> {
  return queryOne<ListingRow>(
    'SELECT * FROM listings WHERE id = $1',
    [id]
  );
}

export async function updateListing(
  id: string,
  sellerId: string,
  input: UpdateListingInput
): Promise<ListingRow | null> {
  // Build dynamic update query
  const fields: string[] = [];
  const values: any[] = [];
  let paramIdx = 1;

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      if (key === 'condition') {
        fields.push(`${key} = $${paramIdx}::condition_enum`);
      } else if (key === 'listing_format') {
        fields.push(`${key} = $${paramIdx}::listing_format_enum`);
      } else if (key === 'status') {
        fields.push(`${key} = $${paramIdx}::listing_status_enum`);
      } else if (key === 'shipping_options') {
        fields.push(`${key} = $${paramIdx}::jsonb`);
        values.push(JSON.stringify(value));
        paramIdx++;
        continue;
      } else {
        fields.push(`${key} = $${paramIdx}`);
      }
      values.push(value);
      paramIdx++;
    }
  }

  if (fields.length === 0) {
    return getListingById(id);
  }

  fields.push(`updated_at = now()`);
  values.push(id);
  values.push(sellerId);

  const queryText = `
    UPDATE listings
    SET ${fields.join(', ')}
    WHERE id = $${paramIdx} AND seller_id = $${paramIdx + 1}
    RETURNING *
  `;

  return queryOne<ListingRow>(queryText, values);
}

export async function listListings(filters: {
  category_id?: string;
  seller_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: ListingRow[]; total: number }> {
  const conditions: string[] = [];
  const values: any[] = [];
  let paramIdx = 1;

  if (filters.category_id) {
    conditions.push(`category_id = $${paramIdx}`);
    values.push(filters.category_id);
    paramIdx++;
  }

  if (filters.seller_id) {
    conditions.push(`seller_id = $${paramIdx}`);
    values.push(filters.seller_id);
    paramIdx++;
  }

  if (filters.status) {
    conditions.push(`status = $${paramIdx}::listing_status_enum`);
    values.push(filters.status);
    paramIdx++;
  } else {
    // default to active if not specified
    conditions.push(`status = 'active'::listing_status_enum`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const limit = filters.limit || 20;
  const offset = filters.offset || 0;

  const countResult = await queryOne<{ count: string }>(
    `SELECT count(*) FROM listings ${whereClause}`,
    values
  );

  const total = parseInt(countResult?.count || '0', 10);

  values.push(limit);
  values.push(offset);
  
  const itemsResult = await query<ListingRow>(
    `SELECT * FROM listings ${whereClause} ORDER BY created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
    values
  );

  return {
    items: itemsResult.rows,
    total,
  };
}
