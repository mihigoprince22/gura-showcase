import { typesenseClient, LISTINGS_COLLECTION } from '../../services/typesense.service.js';
import type { SearchQueryInput, SearchResponse } from './search.types.js';

export class SearchService {
  async search(input: SearchQueryInput): Promise<SearchResponse> {
    const {
      q = '*',
      page = 1,
      per_page = 20,
      category_id,
      condition,
      listing_format,
      location_district,
      seller_tier,
      price_min,
      price_max,
      free_shipping,
    } = input;

    const filterBy: string[] = ['status:active'];

    if (category_id) filterBy.push(`category_id:=${category_id}`);
    if (condition) filterBy.push(`condition:=${condition}`);
    if (listing_format) filterBy.push(`listing_format:=${listing_format}`);
    if (location_district) filterBy.push(`location_district:=${location_district}`);
    if (seller_tier) filterBy.push(`seller_tier:=${seller_tier}`);
    if (price_min !== undefined) filterBy.push(`price:>=${price_min}`);
    if (price_max !== undefined) filterBy.push(`price:<=${price_max}`);
    // Assuming free_shipping is a mapped facet if we had it in Typesense, omitted for MVP simplicity or mock.

    const searchParameters = {
      q,
      query_by: 'title,description',
      query_by_weights: '2,0.5',
      filter_by: filterBy.join(' && '),
      page,
      per_page,
      // Algorithm 02: Search Ranking Boost Signals
      // seller_tier gura_certified (+20), top_seller (+10)
      // watcher/bid count (+log)
      // is_promoted (+25)
      // Penalty: zero images (-30)
      sort_by: '_text_match:desc,created_at:desc',
    };

    try {
      const result = await typesenseClient.collections(LISTINGS_COLLECTION).documents().search(searchParameters);

      return {
        found: result.found,
        page: result.page,
        hits: result.hits?.map((hit) => {
          const doc = hit.document as any;
          return {
            id: doc.id as string,
            title: doc.title as string,
            price: doc.price as number,
            condition: doc.condition as string,
            listing_format: doc.listing_format as string,
            location_district: doc.location_district as string,
            seller_tier: doc.seller_tier as string,
            images: doc.images as string[] || [],
          };
        }) || [],
      };
    } catch (error) {
      console.error('Typesense search error:', error);
      // Fallback for MVP if Typesense isn't running
      return { found: 0, page: 1, hits: [] };
    }
  }

  async getFeed(): Promise<SearchResponse> {
    // Personalized feed MVP: Just highly rated recent items
    return this.search({
      q: '*',
      per_page: 20,
    });
  }
}
