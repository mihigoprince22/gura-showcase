export interface RegisterInput {
  email: string;
  password: string;
  username: string;
  displayName?: string;
  languagePref?: 'en' | 'rw' | 'fr';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  username: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserPublic;
  accessToken: string;
  refreshToken: string;
}

export interface UserPublic {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  locationDistrict: string | null;
  locationCity: string | null;
  sellerRating: number;
  buyerRating: number;
  sellerTier: string;
  verificationStatus: string;
  isSellerEnabled: boolean;
  languagePref: string;
  createdAt: Date;
  lastActiveAt: Date;
}

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location_district: string | null;
  location_city: string | null;
  seller_rating: string;
  buyer_rating: string;
  seller_tier: string;
  verification_status: string;
  stripe_account_id: string | null;
  is_seller_enabled: boolean;
  language_pref: string;
  created_at: Date;
  last_active_at: Date;
}

export interface RefreshTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  revoked_at: Date | null;
}

export interface EmailVerificationTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  used_at: Date | null;
}

export interface PasswordResetTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  used_at: Date | null;
}

export interface RefreshInput {
  refreshToken: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export function toUserPublic(row: UserRow): UserPublic {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    locationDistrict: row.location_district,
    locationCity: row.location_city,
    sellerRating: parseFloat(row.seller_rating),
    buyerRating: parseFloat(row.buyer_rating),
    sellerTier: row.seller_tier,
    verificationStatus: row.verification_status,
    isSellerEnabled: row.is_seller_enabled,
    languagePref: row.language_pref,
    createdAt: row.created_at,
    lastActiveAt: row.last_active_at,
  };
}
