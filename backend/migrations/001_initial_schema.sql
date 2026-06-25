-- GURA Marketplace - Initial Schema Migration
-- All prices in RWF (Rwandan Franc), stored as BIGINT (no decimals)

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================
CREATE TYPE seller_tier_enum AS ENUM ('standard', 'top_seller', 'gura_certified');
CREATE TYPE verification_status_enum AS ENUM ('unverified', 'email', 'id_verified');
CREATE TYPE language_pref_enum AS ENUM ('en', 'rw', 'fr');
CREATE TYPE condition_enum AS ENUM ('new', 'like_new', 'good', 'fair', 'parts_only');
CREATE TYPE listing_format_enum AS ENUM ('fixed', 'auction', 'auction_bin');
CREATE TYPE listing_status_enum AS ENUM ('draft', 'active', 'sold', 'ended', 'moderation_hold');
CREATE TYPE order_status_enum AS ENUM (
  'pending_payment', 'paid', 'packed', 'shipped',
  'delivered', 'complete', 'disputed', 'refunded', 'cancelled'
);
CREATE TYPE reviewer_role_enum AS ENUM ('buyer', 'seller');
CREATE TYPE rating_enum AS ENUM ('positive', 'neutral', 'negative');
CREATE TYPE transaction_status_enum AS ENUM (
  'pending', 'processing', 'succeeded', 'failed', 'refunded', 'disputed'
);

-- ============================================================
-- TABLES
-- ============================================================

-- 1. Users
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(320) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  username        VARCHAR(40) NOT NULL UNIQUE,
  display_name    VARCHAR(100),
  avatar_url      VARCHAR(500),
  bio             TEXT,
  location_district VARCHAR(100),
  location_city   VARCHAR(100),
  seller_rating   DECIMAL(3,2) DEFAULT 0.00,
  buyer_rating    DECIMAL(3,2) DEFAULT 0.00,
  seller_tier     seller_tier_enum NOT NULL DEFAULT 'standard',
  verification_status verification_status_enum NOT NULL DEFAULT 'unverified',
  stripe_account_id VARCHAR(255),
  is_seller_enabled BOOLEAN NOT NULL DEFAULT false,
  language_pref   language_pref_enum NOT NULL DEFAULT 'en',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_active_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Categories
CREATE TABLE categories (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id         UUID REFERENCES categories(id) ON DELETE SET NULL,
  name_en           VARCHAR(100) NOT NULL,
  name_rw           VARCHAR(100) NOT NULL,
  name_fr           VARCHAR(100) NOT NULL,
  slug              VARCHAR(120) NOT NULL UNIQUE,
  icon_name         VARCHAR(50),
  final_value_fee_pct DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  display_order     INTEGER NOT NULL DEFAULT 0
);

-- 3. Listings
CREATE TABLE listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title           VARCHAR(200) NOT NULL,
  description     TEXT NOT NULL,
  condition       condition_enum NOT NULL,
  price           BIGINT NOT NULL CHECK (price >= 0),
  currency        VARCHAR(3) NOT NULL DEFAULT 'rwf',
  listing_format  listing_format_enum NOT NULL DEFAULT 'fixed',
  buy_now_price   BIGINT CHECK (buy_now_price IS NULL OR buy_now_price >= 0),
  starting_bid    BIGINT CHECK (starting_bid IS NULL OR starting_bid >= 0),
  reserve_price   BIGINT CHECK (reserve_price IS NULL OR reserve_price >= 0),
  current_bid     BIGINT CHECK (current_bid IS NULL OR current_bid >= 0),
  bid_count       INTEGER NOT NULL DEFAULT 0,
  auction_end     TIMESTAMPTZ,
  images          VARCHAR(500)[] NOT NULL DEFAULT '{}',
  shipping_options JSONB NOT NULL DEFAULT '[]',
  location_district VARCHAR(100),
  location_city   VARCHAR(100),
  status          listing_status_enum NOT NULL DEFAULT 'draft',
  view_count      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Bids
CREATE TABLE bids (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  bidder_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount      BIGINT NOT NULL CHECK (amount > 0),
  max_amount  BIGINT CHECK (max_amount IS NULL OR max_amount >= amount),
  is_winning  BOOLEAN NOT NULL DEFAULT false,
  placed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Orders
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
  buyer_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  seller_id       UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  amount          BIGINT NOT NULL CHECK (amount > 0),
  platform_fee    BIGINT NOT NULL CHECK (platform_fee >= 0),
  seller_payout   BIGINT NOT NULL CHECK (seller_payout >= 0),
  currency        VARCHAR(3) NOT NULL DEFAULT 'rwf',
  status          order_status_enum NOT NULL DEFAULT 'pending_payment',
  shipping_address JSONB,
  tracking_number VARCHAR(200),
  shipped_at      TIMESTAMPTZ,
  delivered_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Messages
CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id   UUID NOT NULL,
  listing_id  UUID REFERENCES listings(id) ON DELETE SET NULL,
  sender_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  is_flagged  BOOLEAN NOT NULL DEFAULT false,
  flag_reason VARCHAR(200),
  read_at     TIMESTAMPTZ,
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Feedback
CREATE TABLE feedback (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewer_role reviewer_role_enum NOT NULL,
  rating      rating_enum NOT NULL,
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Transactions
CREATE TABLE transactions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  stripe_payment_intent VARCHAR(255) UNIQUE,
  stripe_transfer_id    VARCHAR(255),
  amount                BIGINT NOT NULL CHECK (amount > 0),
  platform_fee          BIGINT NOT NULL CHECK (platform_fee >= 0),
  seller_payout         BIGINT NOT NULL CHECK (seller_payout >= 0),
  currency              VARCHAR(3) NOT NULL DEFAULT 'rwf',
  status                transaction_status_enum NOT NULL DEFAULT 'pending',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Watchlist
CREATE TABLE watchlist (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id        UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  added_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_price_at_add BIGINT,
  UNIQUE(user_id, listing_id)
);

-- 10. Saved Searches
CREATE TABLE saved_searches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  query           VARCHAR(300) NOT NULL,
  filters         JSONB NOT NULL DEFAULT '{}',
  alert_enabled   BOOLEAN NOT NULL DEFAULT true,
  last_alerted_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Refresh Tokens
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(128) NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at  TIMESTAMPTZ
);

-- 12. Email Verification Tokens
CREATE TABLE email_verification_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(128) NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at     TIMESTAMPTZ
);

-- 13. Password Reset Tokens
CREATE TABLE password_reset_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  VARCHAR(128) NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at     TIMESTAMPTZ
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_listings_seller_id ON listings(seller_id);
CREATE INDEX idx_listings_category_id ON listings(category_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);

CREATE INDEX idx_bids_listing_id ON bids(listing_id);
CREATE INDEX idx_bids_bidder_id ON bids(bidder_id);

CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);

CREATE INDEX idx_feedback_reviewee_id ON feedback(reviewee_id);
CREATE INDEX idx_feedback_order_id ON feedback(order_id);

CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_watchlist_listing_id ON watchlist(listing_id);

CREATE INDEX idx_saved_searches_user_id ON saved_searches(user_id);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

CREATE INDEX idx_email_verification_tokens_token_hash ON email_verification_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);

CREATE INDEX idx_transactions_order_id ON transactions(order_id);
