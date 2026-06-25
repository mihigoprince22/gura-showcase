import { query, queryOne } from '../../config/database.js';
import type {
  UserRow,
  RefreshTokenRow,
  EmailVerificationTokenRow,
  PasswordResetTokenRow,
} from './auth.types.js';

// ── User Queries ─────────────────────────────────────────────

export async function createUser(
  email: string,
  passwordHash: string,
  username: string,
  displayName: string | null,
  languagePref: string
): Promise<UserRow> {
  const result = await queryOne<UserRow>(
    `INSERT INTO users (email, password_hash, username, display_name, language_pref)
     VALUES ($1, $2, $3, $4, $5::language_pref_enum)
     RETURNING *`,
    [email, passwordHash, username, displayName, languagePref]
  );
  if (!result) {
    throw new Error('Failed to create user');
  }
  return result;
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  return queryOne<UserRow>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
}

export async function findByUsername(username: string): Promise<UserRow | null> {
  return queryOne<UserRow>(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
}

export async function findById(id: string): Promise<UserRow | null> {
  return queryOne<UserRow>(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
}

export async function updateLastActive(userId: string): Promise<void> {
  await query(
    'UPDATE users SET last_active_at = now() WHERE id = $1',
    [userId]
  );
}

export async function updatePassword(
  userId: string,
  passwordHash: string
): Promise<void> {
  await query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [passwordHash, userId]
  );
}

export async function updateVerificationStatus(
  userId: string,
  status: string
): Promise<void> {
  await query(
    'UPDATE users SET verification_status = $1::verification_status_enum WHERE id = $2',
    [status, userId]
  );
}

// ── Refresh Token Queries ────────────────────────────────────

export async function createRefreshToken(
  userId: string,
  tokenHash: string,
  expiresAt: Date
): Promise<RefreshTokenRow> {
  const result = await queryOne<RefreshTokenRow>(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, tokenHash, expiresAt]
  );
  if (!result) {
    throw new Error('Failed to create refresh token');
  }
  return result;
}

export async function findRefreshToken(
  tokenHash: string
): Promise<RefreshTokenRow | null> {
  return queryOne<RefreshTokenRow>(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = $1
       AND revoked_at IS NULL
       AND expires_at > now()`,
    [tokenHash]
  );
}

export async function revokeRefreshToken(tokenId: string): Promise<void> {
  await query(
    'UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1',
    [tokenId]
  );
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await query(
    'UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL',
    [userId]
  );
}

// ── Email Verification Token Queries ─────────────────────────

export async function createEmailVerificationToken(
  userId: string,
  tokenHash: string,
  expiresAt: Date
): Promise<EmailVerificationTokenRow> {
  const result = await queryOne<EmailVerificationTokenRow>(
    `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, tokenHash, expiresAt]
  );
  if (!result) {
    throw new Error('Failed to create email verification token');
  }
  return result;
}

export async function findEmailVerificationToken(
  tokenHash: string
): Promise<EmailVerificationTokenRow | null> {
  return queryOne<EmailVerificationTokenRow>(
    `SELECT * FROM email_verification_tokens
     WHERE token_hash = $1
       AND used_at IS NULL
       AND expires_at > now()`,
    [tokenHash]
  );
}

export async function markEmailVerificationUsed(tokenId: string): Promise<void> {
  await query(
    'UPDATE email_verification_tokens SET used_at = now() WHERE id = $1',
    [tokenId]
  );
}

// ── Password Reset Token Queries ─────────────────────────────

export async function createPasswordResetToken(
  userId: string,
  tokenHash: string,
  expiresAt: Date
): Promise<PasswordResetTokenRow> {
  const result = await queryOne<PasswordResetTokenRow>(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, tokenHash, expiresAt]
  );
  if (!result) {
    throw new Error('Failed to create password reset token');
  }
  return result;
}

export async function findPasswordResetToken(
  tokenHash: string
): Promise<PasswordResetTokenRow | null> {
  return queryOne<PasswordResetTokenRow>(
    `SELECT * FROM password_reset_tokens
     WHERE token_hash = $1
       AND used_at IS NULL
       AND expires_at > now()`,
    [tokenHash]
  );
}

export async function markPasswordResetUsed(tokenId: string): Promise<void> {
  await query(
    'UPDATE password_reset_tokens SET used_at = now() WHERE id = $1',
    [tokenId]
  );
}
