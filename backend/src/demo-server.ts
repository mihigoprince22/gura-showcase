/**
 * GURA Demo Server — Standalone local preview backend.
 * Runs WITHOUT PostgreSQL, Redis, Stripe, or Typesense.
 * Returns realistic mock data so every mobile screen renders.
 *
 * 20+ listings · 6 categories · 8 sellers · 3 inbox threads
 * 3 orders with tracking · watchlist · saved searches
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';

const PORT = 3000;

// ── In-memory store ─────────────────────────────────────────
const demoUsers: Record<string, any> = {
  'test@example.com': {
    id: 'usr_001',
    email: 'test@example.com',
    username: 'mihigo_prince',
    display_name: 'Mihigo Prince',
    district: 'Kicukiro',
    city: 'Kigali',
    bio: 'GURA early adopter & tech enthusiast 🇷🇼',
    avatar_url: null,
    seller_tier: 'gura_certified',
    seller_rating: 4.8,
    buyer_rating: 4.9,
    verification_status: 'verified',
    language_pref: 'en',
    review_count: 23,
    listing_count: 12,
    sold_count: 4,
    created_at: '2025-01-15T10:00:00Z',
    password: 'password123',
  },
};

// ── Seller directory (for display_name lookups) ─────────────
const sellerDirectory: Record<string, { display_name: string; rating: number }> = {
  usr_001: { display_name: 'Mihigo Prince', rating: 4.8 },
  usr_002: { display_name: 'TechDeals Kigali', rating: 4.8 },
  usr_003: { display_name: 'SneakerHead RW', rating: 4.2 },
  usr_004: { display_name: 'Apple Reseller RW', rating: 4.9 },
  usr_005: { display_name: 'RW Artisan Co', rating: 4.7 },
  usr_006: { display_name: 'GameZone Rwanda', rating: 4.6 },
  usr_007: { display_name: 'AutoMart Kigali', rating: 4.5 },
  usr_008: { display_name: 'HomeLux Rwanda', rating: 4.4 },
};

// ── Categories ──────────────────────────────────────────────
const demoCategories = [
  { id: 'cat_electronics', name: 'Electronics', count: 5, icon: '📱' },
  { id: 'cat_fashion', name: 'Fashion', count: 4, icon: '👗' },
  { id: 'cat_vehicles', name: 'Vehicles', count: 3, icon: '🚗' },
  { id: 'cat_home', name: 'Home & Living', count: 3, icon: '🏠' },
  { id: 'cat_art', name: 'Art & Crafts', count: 3, icon: '🎨' },
  { id: 'cat_sports', name: 'Sports', count: 2, icon: '⚽' },
];

// ── Listings (20 items across 6 categories) ─────────────────
const demoListings: any[] = [
  // ─── Electronics (5) ───────────────────────────────────
  {
    id: 'lst_001',
    title: 'iPhone 14 Pro Max 256GB',
    description:
      'Brand new, sealed in box. Bought from Dubai duty-free. Full Apple warranty. Deep Purple colour.',
    price: 850000,
    currency: 'RWF',
    category_id: 'cat_electronics',
    category_name: 'Electronics',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_004',
    seller_name: 'Apple Reseller RW',
    seller_rating: 4.9,
    location_district: 'Nyarugenge',
    location_city: 'Kigali',
    views: 234,
    watchlist_count: 12,
    created_at: '2025-06-20T10:00:00Z',
  },
  {
    id: 'lst_002',
    title: 'Samsung Galaxy S24 Ultra',
    description:
      'Lightly used, 512GB, Titanium Grey. Comes with original box, S Pen, and all accessories. Screen protector since day one.',
    price: 720000,
    currency: 'RWF',
    category_id: 'cat_electronics',
    category_name: 'Electronics',
    condition: 'like_new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_002',
    seller_name: 'TechDeals Kigali',
    seller_rating: 4.8,
    location_district: 'Kicukiro',
    location_city: 'Kigali',
    views: 189,
    watchlist_count: 8,
    created_at: '2025-06-19T14:30:00Z',
  },
  {
    id: 'lst_003',
    title: 'MacBook Pro M3 14-inch',
    description:
      '16GB RAM, 512GB SSD. Perfect for developers and creatives. Space Black. AppleCare+ until 2027.',
    price: 1200000,
    currency: 'RWF',
    category_id: 'cat_electronics',
    category_name: 'Electronics',
    condition: 'new',
    status: 'active',
    listing_type: 'auction',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_004',
    seller_name: 'Apple Reseller RW',
    seller_rating: 4.9,
    location_district: 'Nyarugenge',
    location_city: 'Kigali',
    views: 412,
    watchlist_count: 23,
    created_at: '2025-06-17T16:00:00Z',
  },
  {
    id: 'lst_004',
    title: 'PlayStation 5 Slim',
    description:
      'Brand new, sealed. Digital Edition. Comes with 2 DualSense controllers and 3 games (Spider-Man 2, FC 25, GT7).',
    price: 480000,
    currency: 'RWF',
    category_id: 'cat_electronics',
    category_name: 'Electronics',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_006',
    seller_name: 'GameZone Rwanda',
    seller_rating: 4.6,
    location_district: 'Kicukiro',
    location_city: 'Kigali',
    views: 301,
    watchlist_count: 19,
    created_at: '2025-06-15T08:30:00Z',
  },
  {
    id: 'lst_005',
    title: 'Sony WH-1000XM5 Headphones',
    description:
      'Industry-leading noise cancelling. Black colour. Used for 2 months, perfect condition. Includes carry case and cable.',
    price: 180000,
    currency: 'RWF',
    category_id: 'cat_electronics',
    category_name: 'Electronics',
    condition: 'like_new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_002',
    seller_name: 'TechDeals Kigali',
    seller_rating: 4.8,
    location_district: 'Kicukiro',
    location_city: 'Kigali',
    views: 145,
    watchlist_count: 7,
    created_at: '2025-06-14T11:00:00Z',
  },

  // ─── Fashion (4) ───────────────────────────────────────
  {
    id: 'lst_006',
    title: 'Nike Air Max 90 Size 43',
    description:
      'Authentic Nike Air Max 90, imported from USA. Worn twice indoors, excellent condition. White/Black colourway.',
    price: 65000,
    currency: 'RWF',
    category_id: 'cat_fashion',
    category_name: 'Fashion',
    condition: 'like_new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_003',
    seller_name: 'SneakerHead RW',
    seller_rating: 4.2,
    location_district: 'Gasabo',
    location_city: 'Kigali',
    views: 97,
    watchlist_count: 5,
    created_at: '2025-06-18T09:00:00Z',
  },
  {
    id: 'lst_007',
    title: 'Vintage Leather Bag Handcrafted',
    description:
      'Made by local Rwandan artisans in Huye. Genuine full-grain leather, unique hand-stitched design. Perfect for everyday use.',
    price: 45000,
    currency: 'RWF',
    category_id: 'cat_fashion',
    category_name: 'Fashion',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_005',
    seller_name: 'RW Artisan Co',
    seller_rating: 4.7,
    location_district: 'Nyarugenge',
    location_city: 'Kigali',
    views: 156,
    watchlist_count: 14,
    created_at: '2025-06-16T11:00:00Z',
  },
  {
    id: 'lst_008',
    title: 'Ankara Print Dress Collection',
    description:
      'Set of 3 stunning Ankara print dresses. Sizes S, M, L available. Vibrant African wax print fabric, tailored in Kigali.',
    price: 35000,
    currency: 'RWF',
    category_id: 'cat_fashion',
    category_name: 'Fashion',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_005',
    seller_name: 'RW Artisan Co',
    seller_rating: 4.7,
    location_district: 'Nyarugenge',
    location_city: 'Kigali',
    views: 88,
    watchlist_count: 6,
    created_at: '2025-06-13T14:00:00Z',
  },
  {
    id: 'lst_009',
    title: 'Ray-Ban Aviator Sunglasses',
    description:
      'Classic Ray-Ban Aviator RB3025. Gold frame, green G-15 lenses. Brand new with case and certificate of authenticity.',
    price: 55000,
    currency: 'RWF',
    category_id: 'cat_fashion',
    category_name: 'Fashion',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_003',
    seller_name: 'SneakerHead RW',
    seller_rating: 4.2,
    location_district: 'Gasabo',
    location_city: 'Kigali',
    views: 73,
    watchlist_count: 4,
    created_at: '2025-06-12T10:00:00Z',
  },

  // ─── Vehicles (3) ─────────────────────────────────────
  {
    id: 'lst_010',
    title: 'Toyota RAV4 2019',
    description:
      'Toyota RAV4 XLE 2019, 45,000 km. Clean CARFAX, single owner. Petrol, AWD, automatic. Full service history at Toyota Kigali.',
    price: 18500000,
    currency: 'RWF',
    category_id: 'cat_vehicles',
    category_name: 'Vehicles',
    condition: 'used',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_007',
    seller_name: 'AutoMart Kigali',
    seller_rating: 4.5,
    location_district: 'Gasabo',
    location_city: 'Kigali',
    views: 567,
    watchlist_count: 31,
    created_at: '2025-06-11T08:00:00Z',
  },
  {
    id: 'lst_011',
    title: 'Honda Civic 2020',
    description:
      'Honda Civic EX 2020, 32,000 km. Crystal Black Pearl. One owner, garage kept. Apple CarPlay, Honda Sensing suite.',
    price: 16000000,
    currency: 'RWF',
    category_id: 'cat_vehicles',
    category_name: 'Vehicles',
    condition: 'used',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_007',
    seller_name: 'AutoMart Kigali',
    seller_rating: 4.5,
    location_district: 'Gasabo',
    location_city: 'Kigali',
    views: 423,
    watchlist_count: 22,
    created_at: '2025-06-10T09:30:00Z',
  },
  {
    id: 'lst_012',
    title: 'Yamaha MT-07 Motorcycle',
    description:
      'Yamaha MT-07 2023, 8,000 km. Matte Raven Black. ABS, ride-by-wire. Comes with Akrapovic exhaust and tail tidy kit.',
    price: 8500000,
    currency: 'RWF',
    category_id: 'cat_vehicles',
    category_name: 'Vehicles',
    condition: 'like_new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_007',
    seller_name: 'AutoMart Kigali',
    seller_rating: 4.5,
    location_district: 'Gasabo',
    location_city: 'Kigali',
    views: 289,
    watchlist_count: 17,
    created_at: '2025-06-09T15:00:00Z',
  },

  // ─── Home & Living (3) ────────────────────────────────
  {
    id: 'lst_013',
    title: 'Samsung 55" Smart TV',
    description:
      'Samsung Crystal UHD 55" 4K Smart TV (2024 model). Built-in Tizen OS, Netflix, YouTube. Wall mount included.',
    price: 380000,
    currency: 'RWF',
    category_id: 'cat_home',
    category_name: 'Home & Living',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_008',
    seller_name: 'HomeLux Rwanda',
    seller_rating: 4.4,
    location_district: 'Kicukiro',
    location_city: 'Kigali',
    views: 198,
    watchlist_count: 11,
    created_at: '2025-06-08T12:00:00Z',
  },
  {
    id: 'lst_014',
    title: 'Handwoven Agaseke Basket Set',
    description:
      'Set of 5 traditional Rwandan Agaseke peace baskets. Various sizes and patterns. Handwoven by cooperative women in Butare.',
    price: 28000,
    currency: 'RWF',
    category_id: 'cat_home',
    category_name: 'Home & Living',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_005',
    seller_name: 'RW Artisan Co',
    seller_rating: 4.7,
    location_district: 'Nyarugenge',
    location_city: 'Kigali',
    views: 134,
    watchlist_count: 9,
    created_at: '2025-06-07T10:00:00Z',
  },
  {
    id: 'lst_015',
    title: 'Modern Office Desk & Chair',
    description:
      'Ergonomic standing desk (adjustable height) with mesh office chair. Perfect for home office or co-working space. Assembly included.',
    price: 175000,
    currency: 'RWF',
    category_id: 'cat_home',
    category_name: 'Home & Living',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_008',
    seller_name: 'HomeLux Rwanda',
    seller_rating: 4.4,
    location_district: 'Kicukiro',
    location_city: 'Kigali',
    views: 112,
    watchlist_count: 8,
    created_at: '2025-06-06T14:00:00Z',
  },

  // ─── Art & Crafts (3) ─────────────────────────────────
  {
    id: 'lst_016',
    title: 'Traditional Imigongo Art Panel',
    description:
      'Authentic Imigongo art from Eastern Rwanda. 60x90cm panel. Geometric cow-dung art, a UNESCO-recognized Rwandan tradition.',
    price: 95000,
    currency: 'RWF',
    category_id: 'cat_art',
    category_name: 'Art & Crafts',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_005',
    seller_name: 'RW Artisan Co',
    seller_rating: 4.7,
    location_district: 'Nyarugenge',
    location_city: 'Kigali',
    views: 201,
    watchlist_count: 15,
    created_at: '2025-06-05T09:00:00Z',
  },
  {
    id: 'lst_017',
    title: 'Contemporary Rwandan Canvas Painting',
    description:
      'Original acrylic on canvas by Kigali-based artist. 80x100cm. "Hills of a Thousand Dreams" — vivid depiction of Rwandan hills.',
    price: 120000,
    currency: 'RWF',
    category_id: 'cat_art',
    category_name: 'Art & Crafts',
    condition: 'new',
    status: 'active',
    listing_type: 'auction',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_001',
    seller_name: 'Mihigo Prince',
    seller_rating: 4.8,
    location_district: 'Kicukiro',
    location_city: 'Kigali',
    views: 178,
    watchlist_count: 13,
    created_at: '2025-06-04T11:00:00Z',
  },
  {
    id: 'lst_018',
    title: 'Carved Wooden Sculpture Set',
    description:
      'Set of 3 hand-carved mahogany sculptures. Traditional Rwandan drummer, dancer, and storyteller figures. Each ~30cm tall.',
    price: 68000,
    currency: 'RWF',
    category_id: 'cat_art',
    category_name: 'Art & Crafts',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_005',
    seller_name: 'RW Artisan Co',
    seller_rating: 4.7,
    location_district: 'Nyarugenge',
    location_city: 'Kigali',
    views: 143,
    watchlist_count: 10,
    created_at: '2025-06-03T13:00:00Z',
  },

  // ─── Sports (2) ───────────────────────────────────────
  {
    id: 'lst_019',
    title: 'Mountain Bike Trek Marlin 7',
    description:
      'Trek Marlin 7, 2024 model. Size L (29"). Shimano Deore 1x10, hydraulic disc brakes. Used for 3 months on Kigali trails.',
    price: 450000,
    currency: 'RWF',
    category_id: 'cat_sports',
    category_name: 'Sports',
    condition: 'like_new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_001',
    seller_name: 'Mihigo Prince',
    seller_rating: 4.8,
    location_district: 'Kicukiro',
    location_city: 'Kigali',
    views: 167,
    watchlist_count: 12,
    created_at: '2025-06-02T10:00:00Z',
  },
  {
    id: 'lst_020',
    title: 'Adidas Football Boots',
    description:
      'Adidas Predator Elite FG, Size 42. Solar Energy colourway. Brand new, never worn on pitch. Perfect for firm ground.',
    price: 42000,
    currency: 'RWF',
    category_id: 'cat_sports',
    category_name: 'Sports',
    condition: 'new',
    status: 'active',
    listing_type: 'fixed',
    images: [
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
    ],
    seller_id: 'usr_003',
    seller_name: 'SneakerHead RW',
    seller_rating: 4.2,
    location_district: 'Gasabo',
    location_city: 'Kigali',
    views: 92,
    watchlist_count: 3,
    created_at: '2025-06-01T16:00:00Z',
  },
];

// ── Orders (3 with different statuses) ──────────────────────
const demoOrders = [
  {
    id: 'ord_001',
    listing_id: 'lst_002',
    listing_title: 'Samsung Galaxy S24 Ultra',
    listing_image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    amount: 700000,
    currency: 'RWF',
    status: 'complete',
    payment_method: 'momo',
    buyer_id: 'usr_001',
    buyer_name: 'Mihigo Prince',
    seller_id: 'usr_002',
    seller_name: 'TechDeals Kigali',
    tracking_number: null,
    completed_at: '2025-06-12T14:00:00Z',
    created_at: '2025-06-10T12:00:00Z',
  },
  {
    id: 'ord_002',
    listing_id: 'lst_006',
    listing_title: 'Nike Air Max 90 Size 43',
    listing_image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    amount: 65000,
    currency: 'RWF',
    status: 'shipped',
    payment_method: 'momo',
    buyer_id: 'usr_001',
    buyer_name: 'Mihigo Prince',
    seller_id: 'usr_003',
    seller_name: 'SneakerHead RW',
    tracking_number: 'RW-2025-78432',
    completed_at: null,
    created_at: '2025-06-18T15:00:00Z',
  },
  {
    id: 'ord_003',
    listing_id: 'lst_008',
    listing_title: 'Ankara Print Dress Collection',
    listing_image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    amount: 35000,
    currency: 'RWF',
    status: 'paid',
    payment_method: 'momo',
    buyer_id: 'usr_001',
    buyer_name: 'Mihigo Prince',
    seller_id: 'usr_005',
    seller_name: 'RW Artisan Co',
    tracking_number: null,
    completed_at: null,
    created_at: '2025-06-21T09:00:00Z',
  },
];

// ── Message Threads (3 conversations) ───────────────────────
const demoMessageThreads = [
  {
    thread_id: 'thr_001',
    other_user: { id: 'usr_002', display_name: 'TechDeals Kigali', avatar_url: null },
    listing: {
      id: 'lst_002',
      title: 'Samsung Galaxy S24 Ultra',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    },
    last_message: 'Is 700,000 RWF your final price?',
    last_message_at: '2025-06-20T15:45:00Z',
    unread_count: 2,
  },
  {
    thread_id: 'thr_002',
    other_user: { id: 'usr_005', display_name: 'RW Artisan Co', avatar_url: null },
    listing: {
      id: 'lst_007',
      title: 'Vintage Leather Bag Handcrafted',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800',
    },
    last_message: 'I can deliver to Kicukiro tomorrow',
    last_message_at: '2025-06-20T12:10:00Z',
    unread_count: 1,
  },
  {
    thread_id: 'thr_003',
    other_user: { id: 'usr_006', display_name: 'GameZone Rwanda', avatar_url: null },
    listing: {
      id: 'lst_004',
      title: 'PlayStation 5 Slim',
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=800',
    },
    last_message: 'Deal! I will pay via MoMo',
    last_message_at: '2025-06-19T18:00:00Z',
    unread_count: 0,
  },
];

// ── Per-thread chat messages ────────────────────────────────
const demoThreadMessages: Record<string, any[]> = {
  thr_001: [
    {
      id: 'msg_001',
      body: "Hi, I'm interested in the Samsung Galaxy S24 Ultra. Is it still available?",
      sender_id: 'usr_001',
      sent_at: '2025-06-20T15:00:00Z',
    },
    {
      id: 'msg_002',
      body: "Yes it is! It's in perfect condition. Would you like to see more photos?",
      sender_id: 'usr_002',
      sent_at: '2025-06-20T15:10:00Z',
    },
    {
      id: 'msg_003',
      body: 'That would be great. Also, is the price negotiable?',
      sender_id: 'usr_001',
      sent_at: '2025-06-20T15:20:00Z',
    },
    {
      id: 'msg_004',
      body: "I can go down to 700,000 RWF. That's my best offer since it includes all accessories.",
      sender_id: 'usr_002',
      sent_at: '2025-06-20T15:35:00Z',
    },
    {
      id: 'msg_005',
      body: 'Is 700,000 RWF your final price?',
      sender_id: 'usr_001',
      sent_at: '2025-06-20T15:45:00Z',
    },
  ],
  thr_002: [
    {
      id: 'msg_010',
      body: 'Hello! I love the leather bag. Can you tell me more about the craftsmanship?',
      sender_id: 'usr_001',
      sent_at: '2025-06-20T10:00:00Z',
    },
    {
      id: 'msg_011',
      body: "Thank you! It's handmade by women artisans in Huye. Each bag takes about 3 days to make.",
      sender_id: 'usr_005',
      sent_at: '2025-06-20T10:30:00Z',
    },
    {
      id: 'msg_012',
      body: "That's beautiful. Can you deliver to Kicukiro?",
      sender_id: 'usr_001',
      sent_at: '2025-06-20T11:45:00Z',
    },
    {
      id: 'msg_013',
      body: 'I can deliver to Kicukiro tomorrow',
      sender_id: 'usr_005',
      sent_at: '2025-06-20T12:10:00Z',
    },
  ],
  thr_003: [
    {
      id: 'msg_020',
      body: 'Is the PS5 Slim still available? Does it come with warranty?',
      sender_id: 'usr_001',
      sent_at: '2025-06-19T16:00:00Z',
    },
    {
      id: 'msg_021',
      body: 'Yes! Brand new and sealed. 1 year Sony warranty. Price is firm at 480,000 RWF.',
      sender_id: 'usr_006',
      sent_at: '2025-06-19T16:30:00Z',
    },
    {
      id: 'msg_022',
      body: 'Sounds good. Can I pick it up from your store in Kicukiro?',
      sender_id: 'usr_001',
      sent_at: '2025-06-19T17:15:00Z',
    },
    {
      id: 'msg_023',
      body: "Of course! We're open until 7 PM. Or I can deliver for 2,000 RWF.",
      sender_id: 'usr_006',
      sent_at: '2025-06-19T17:30:00Z',
    },
    {
      id: 'msg_024',
      body: 'Deal! I will pay via MoMo',
      sender_id: 'usr_001',
      sent_at: '2025-06-19T18:00:00Z',
    },
  ],
};

// ── Watchlist (seeded with 3 actual listings) ───────────────
const demoWatchlist = ['lst_002', 'lst_010', 'lst_016'];

// ── Saved Searches ──────────────────────────────────────────
const demoSavedSearches = [
  {
    id: 'ss_001',
    query: 'iPhone',
    filters: { category: 'Electronics' },
    alert_enabled: true,
    created_at: '2025-06-15T10:00:00Z',
  },
  {
    id: 'ss_002',
    query: 'Leather bag',
    filters: { category: 'Fashion' },
    alert_enabled: false,
    created_at: '2025-06-12T08:30:00Z',
  },
  {
    id: 'ss_003',
    query: 'Toyota',
    filters: { category: 'Vehicles', district: 'Gasabo' },
    alert_enabled: true,
    created_at: '2025-06-10T14:00:00Z',
  },
];

let tokenCounter = 0;
let listingCounter = 20; // start after lst_020

function makeToken() {
  tokenCounter++;
  return `demo_token_${tokenCounter}_${Date.now()}`;
}

// ── Build Server ────────────────────────────────────────────
async function buildDemoServer() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, { origin: '*' });

  // ── Health ───────────────────────────────────────────────
  app.get('/health', async () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0-demo',
    services: { database: 'mock', redis: 'mock', stripe: 'mock' },
  }));

  // ── Auth Routes ──────────────────────────────────────────
  app.post('/v1/auth/register', async (req, reply) => {
    const { email, username, password, district } = req.body as any;
    const newUser = {
      id: `usr_${Date.now()}`,
      email,
      username,
      display_name: username,
      district: district || 'Kigali',
      city: '',
      bio: '',
      avatar_url: null,
      seller_tier: 'new',
      seller_rating: 0,
      buyer_rating: 0,
      verification_status: 'none',
      language_pref: 'en',
      review_count: 0,
      listing_count: 0,
      sold_count: 0,
      created_at: new Date().toISOString(),
      password,
    };
    demoUsers[email] = newUser;
    const token = makeToken();
    const refreshToken = makeToken();
    const { password: _, ...safeUser } = newUser;
    return {
      success: true,
      data: { token, refreshToken, user: safeUser },
      message: 'Registration successful',
    };
  });

  app.post('/v1/auth/login', async (req, reply) => {
    const { email, password } = req.body as any;
    const user = demoUsers[email];
    if (!user || user.password !== password) {
      reply.status(401);
      return { success: false, message: 'Invalid email or password' };
    }
    const token = makeToken();
    const refreshToken = makeToken();
    const { password: _, ...safeUser } = user;
    return {
      success: true,
      data: { token, refreshToken, user: safeUser },
      message: 'Login successful',
    };
  });

  app.post('/v1/auth/logout', async () => ({
    success: true,
    message: 'Logged out',
  }));

  app.post('/v1/auth/refresh', async () => ({
    success: true,
    data: { token: makeToken(), refreshToken: makeToken() },
  }));

  app.get('/v1/auth/me', async () => {
    const user = demoUsers['test@example.com'];
    const { password: _, ...safeUser } = user;
    return { success: true, data: safeUser };
  });

  app.post('/v1/auth/forgot-password', async () => ({
    success: true,
    message: 'Password reset link sent to your email',
  }));

  app.post('/v1/auth/reset-password', async () => ({
    success: true,
    message: 'Password reset successful',
  }));

  // ── Categories Routes ───────────────────────────────────
  app.get('/v1/categories', async () => {
    // Recount dynamically based on current listings
    const counts: Record<string, number> = {};
    for (const l of demoListings) {
      counts[l.category_id] = (counts[l.category_id] || 0) + 1;
    }
    const cats = demoCategories.map((c) => ({
      ...c,
      count: counts[c.id] || 0,
    }));
    return { success: true, data: cats };
  });

  // ── Listings Routes ──────────────────────────────────────
  app.get('/v1/listings', async (req) => {
    const query = req.query as any;
    let results = [...demoListings];

    if (query.category_id) {
      results = results.filter((l) => l.category_id === query.category_id);
    }
    if (query.district) {
      results = results.filter(
        (l) => l.location_district.toLowerCase() === (query.district as string).toLowerCase()
      );
    }
    if (query.seller_id) {
      results = results.filter((l) => l.seller_id === query.seller_id);
    }
    if (query.status) {
      results = results.filter((l) => l.status === query.status);
    }

    return {
      success: true,
      data: {
        listings: results,
        total: results.length,
        page: 1,
        limit: 20,
      },
    };
  });

  app.get('/v1/listings/feed', async () => {
    const activeListings = demoListings.filter((l) => l.status === 'active');
    return {
      success: true,
      data: {
        listings: activeListings,
        total: activeListings.length,
        page: 1,
        limit: 20,
      },
    };
  });

  app.get('/v1/listings/:id', async (req) => {
    const { id } = req.params as any;
    const listing = demoListings.find((l) => l.id === id) || demoListings[0];
    return { success: true, data: listing };
  });

  app.post('/v1/listings', async (req) => {
    listingCounter++;
    const body = req.body as any;
    const newListing = {
      id: `lst_${String(listingCounter).padStart(3, '0')}`,
      title: body.title || 'Untitled Listing',
      description: body.description || '',
      price: body.price || 0,
      currency: body.currency || 'RWF',
      category_id: body.category_id || 'cat_electronics',
      category_name: body.category_name || 'Electronics',
      condition: body.condition || 'new',
      status: 'active',
      listing_type: body.listing_type || 'fixed',
      images: body.images || ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800'],
      seller_id: 'usr_001',
      seller_name: 'Mihigo Prince',
      seller_rating: 4.8,
      location_district: body.location_district || body.district || 'Kicukiro',
      location_city: body.location_city || body.city || 'Kigali',
      views: 0,
      watchlist_count: 0,
      created_at: new Date().toISOString(),
      ...body,
    };
    // Ensure the id we assigned takes precedence
    newListing.id = `lst_${String(listingCounter).padStart(3, '0')}`;
    newListing.status = 'active';

    demoListings.unshift(newListing);

    return {
      success: true,
      data: newListing,
      message: 'Listing created',
    };
  });

  app.get('/v1/listings/price-intelligence', async () => ({
    success: true,
    data: { median: 650000, min_sold: 450000, max_sold: 900000, sold_count: 23 },
  }));

  // ── Search Routes ────────────────────────────────────────
  const searchHandler = async (req: any) => {
    const { q } = req.query as any;
    const results = q
      ? demoListings.filter(
          (l) =>
            l.title.toLowerCase().includes((q as string).toLowerCase()) ||
            l.description.toLowerCase().includes((q as string).toLowerCase())
        )
      : demoListings;
    return {
      success: true,
      data: { listings: results, total: results.length },
    };
  };

  app.get('/v1/search', searchHandler);
  app.get('/v1/search/feed', searchHandler);

  // ── Auctions Routes ──────────────────────────────────────
  app.get('/v1/auctions/:id', async (req) => {
    const { id } = req.params as any;
    const listing =
      demoListings.find((l) => l.id === id && l.listing_type === 'auction') ||
      demoListings.find((l) => l.listing_type === 'auction') ||
      demoListings[2];
    return {
      success: true,
      data: {
        ...listing,
        current_bid: listing.price + 150000,
        bid_count: 7,
        highest_bidder_id: 'usr_003',
        ends_at: new Date(Date.now() + 86400000).toISOString(),
      },
    };
  });

  app.post('/v1/auctions/:id/bid', async () => ({
    success: true,
    data: { bid_id: `bid_${Date.now()}`, amount: 1400000 },
    message: 'Bid placed successfully',
  }));

  // ── Orders Routes ────────────────────────────────────────
  app.get('/v1/orders', async (req) => {
    const query = req.query as any;
    let orders = [...demoOrders];

    if (query.role === 'seller') {
      orders = orders.filter((o) => o.seller_id === 'usr_001');
    } else if (query.role === 'buyer') {
      orders = orders.filter((o) => o.buyer_id === 'usr_001');
    }

    return {
      success: true,
      data: { orders, total: orders.length },
    };
  });

  app.get('/v1/orders/:id', async (req) => {
    const { id } = req.params as any;
    const order = demoOrders.find((o) => o.id === id) || demoOrders[0];
    return { success: true, data: order };
  });

  app.post('/v1/orders', async () => ({
    success: true,
    data: { id: `ord_${Date.now()}`, status: 'pending_payment' },
    message: 'Order created',
  }));

  app.post('/v1/orders/checkout', async (req) => {
    const body = req.body as any;
    const listingId = body.listing_id;
    
    // Find listing and update to sold
    const listing = demoListings.find(l => l.id === listingId);
    if (listing) {
      listing.status = 'sold';
    }

    // Create mock order
    const orderId = `ord_${Date.now()}`;
    const newOrder = {
      id: orderId,
      listing_id: listingId,
      title: listing ? listing.title : 'Item',
      amount: listing ? listing.price : 0,
      currency: 'RWF',
      status: 'paid',
      buyer_id: 'usr_001',
      seller_id: listing ? listing.seller_id : 'usr_002',
      seller_name: listing ? listing.seller_name : 'Seller',
      created_at: new Date().toISOString(),
      thumbnail: listing && listing.images ? listing.images[0] : null
    };
    
    demoOrders.push(newOrder as any);

    return {
      success: true,
      data: newOrder,
      message: 'Checkout successful'
    };
  });

  // ── Messages Routes ──────────────────────────────────────
  const inboxHandler = async () => ({
    success: true,
    data: {
      threads: demoMessageThreads,
      total: demoMessageThreads.length,
      unread_total: demoMessageThreads.reduce((sum, t) => sum + t.unread_count, 0),
    },
  });

  app.get('/v1/messages', inboxHandler);
  app.get('/v1/messages/inbox', inboxHandler);

  app.get('/v1/messages/:threadId', async (req) => {
    const { threadId } = req.params as any;
    const messages = demoThreadMessages[threadId] || demoThreadMessages['thr_001'];
    const thread = demoMessageThreads.find((t) => t.thread_id === threadId) || demoMessageThreads[0];
    return {
      success: true,
      data: {
        thread,
        messages,
      },
    };
  });

  app.post('/v1/messages/:threadId', async (req) => {
    const { threadId } = req.params as any;
    const body = req.body as any;
    const newMsg = {
      id: `msg_${Date.now()}`,
      body: body.body || body.message || '',
      sender_id: 'usr_001',
      sent_at: new Date().toISOString(),
    };

    // Persist in-memory
    if (!demoThreadMessages[threadId]) {
      demoThreadMessages[threadId] = [];
    }
    demoThreadMessages[threadId].push(newMsg);

    // Update thread's last message
    const thread = demoMessageThreads.find((t) => t.thread_id === threadId);
    if (thread) {
      thread.last_message = newMsg.body;
      thread.last_message_at = newMsg.sent_at;
    }

    return {
      success: true,
      data: newMsg,
      message: 'Message sent',
    };
  });

  // ── Reviews/Feedback Routes ──────────────────────────────
  app.get('/v1/reviews', async () => ({
    success: true,
    data: {
      reviews: [
        {
          id: 'rev_001',
          rating: 'positive',
          comment: 'Great seller, fast delivery!',
          reviewer_id: 'usr_003',
          reviewer_name: 'SneakerHead RW',
          created_at: '2025-06-12T10:00:00Z',
        },
        {
          id: 'rev_002',
          rating: 'positive',
          comment: 'Item exactly as described. Packaged perfectly.',
          reviewer_id: 'usr_002',
          reviewer_name: 'TechDeals Kigali',
          created_at: '2025-06-08T14:30:00Z',
        },
        {
          id: 'rev_003',
          rating: 'positive',
          comment: 'Very responsive and professional. Would buy again!',
          reviewer_id: 'usr_005',
          reviewer_name: 'RW Artisan Co',
          created_at: '2025-06-05T09:00:00Z',
        },
      ],
    },
  }));

  app.post('/v1/reviews', async () => ({
    success: true,
    message: 'Review submitted',
  }));

  // ── Users Routes ─────────────────────────────────────────
  app.get('/v1/users/me', async () => {
    const user = demoUsers['test@example.com'];
    const { password: _, ...safeUser } = user;
    return { success: true, data: safeUser };
  });

  app.put('/v1/users/me', async (req) => {
    const updates = req.body as any;
    Object.assign(demoUsers['test@example.com'], updates);
    const { password: _, ...safeUser } = demoUsers['test@example.com'];
    return { success: true, data: safeUser };
  });

  app.get('/v1/users/:username', async (req) => {
    const { username } = req.params as any;
    // Try to find the user by username, fall back to default
    const user =
      Object.values(demoUsers).find((u: any) => u.username === username) ||
      demoUsers['test@example.com'];
    const { password: _, ...safeUser } = user as any;
    return { success: true, data: safeUser };
  });

  // ── Watchlist Routes ─────────────────────────────────────
  app.get('/v1/watchlist', async () => {
    const items = demoWatchlist
      .map((id) => demoListings.find((l) => l.id === id))
      .filter(Boolean);
    return {
      success: true,
      data: {
        items,
        total: items.length,
      },
    };
  });

  app.post('/v1/watchlist', async (req) => {
    const body = req.body as any;
    const listingId = body.listing_id || body.listingId;
    if (listingId && !demoWatchlist.includes(listingId)) {
      demoWatchlist.push(listingId);
    }
    return {
      success: true,
      message: 'Added to watchlist',
    };
  });

  app.delete('/v1/watchlist/:listingId', async (req) => {
    const { listingId } = req.params as any;
    const idx = demoWatchlist.indexOf(listingId);
    if (idx !== -1) demoWatchlist.splice(idx, 1);
    return {
      success: true,
      message: 'Removed from watchlist',
    };
  });

  // ── Saved Searches Routes ────────────────────────────────
  app.get('/v1/saved-searches', async () => ({
    success: true,
    data: {
      searches: demoSavedSearches,
      total: demoSavedSearches.length,
    },
  }));

  app.post('/v1/saved-searches', async (req) => {
    const body = req.body as any;
    const newSearch = {
      id: `ss_${Date.now()}`,
      query: body.query || '',
      filters: body.filters || {},
      alert_enabled: body.alert_enabled ?? true,
      created_at: new Date().toISOString(),
    };
    demoSavedSearches.push(newSearch);
    return {
      success: true,
      data: newSearch,
      message: 'Search saved',
    };
  });

  app.delete('/v1/saved-searches/:id', async (req) => {
    const { id } = req.params as any;
    const idx = demoSavedSearches.findIndex((s) => s.id === id);
    if (idx !== -1) demoSavedSearches.splice(idx, 1);
    return {
      success: true,
      message: 'Search removed',
    };
  });

  // ── Notifications Routes ─────────────────────────────────
  app.post('/v1/notifications/push-token', async () => ({
    success: true,
    message: 'Push token saved',
  }));

  app.get('/v1/notifications/preferences', async () => ({
    success: true,
    data: {
      new_message: true,
      order_update: true,
      price_drop: true,
      auction_outbid: true,
    },
  }));

  app.put('/v1/notifications/preferences', async () => ({
    success: true,
    message: 'Preferences updated',
  }));

  // ── Payments Routes ──────────────────────────────────────
  app.post('/v1/payments/webhook', async () => ({
    success: true,
  }));

  return app;
}

// ── Start ───────────────────────────────────────────────────
async function start() {
  const app = await buildDemoServer();
  await app.listen({ port: PORT, host: '0.0.0.0' });
  app.log.info(`🟢 GURA Demo API running on http://localhost:${PORT}`);
  app.log.info('📦 Using in-memory mock data — no database required');
  app.log.info(`📋 ${demoListings.length} listings across ${demoCategories.length} categories`);
  app.log.info('🔑 Test login: test@example.com / password123');
  app.log.info('👤 Default user: Mihigo Prince (usr_001)');
}

start();
