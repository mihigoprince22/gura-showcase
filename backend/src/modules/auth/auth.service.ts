import type { FastifyInstance } from 'fastify';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { generateToken, hashToken } from '../../utils/tokens.js';
import * as authRepo from './auth.repository.js';
import type {
  AuthResponse,
  RegisterInput,
  LoginInput,
  TokenPayload,
  UserPublic,
} from './auth.types.js';
import { toUserPublic } from './auth.types.js';

const REFRESH_TOKEN_EXPIRY_DAYS = 30;
const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
const PASSWORD_RESET_EXPIRY_HOURS = 1;

function addDays(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function addHours(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
}

export class AuthService {
  constructor(private readonly fastify: FastifyInstance) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    // Check for existing email
    const existingEmail = await authRepo.findByEmail(input.email.toLowerCase());
    if (existingEmail) {
      throw createHttpError(409, 'An account with this email already exists');
    }

    // Check for existing username
    const existingUsername = await authRepo.findByUsername(input.username.toLowerCase());
    if (existingUsername) {
      throw createHttpError(409, 'This username is already taken');
    }

    // Hash password and create user
    const passwordHash = await hashPassword(input.password);
    const userRow = await authRepo.createUser(
      input.email.toLowerCase(),
      passwordHash,
      input.username.toLowerCase(),
      input.displayName ?? null,
      input.languagePref ?? 'en'
    );

    // Generate email verification token
    const emailToken = generateToken();
    const emailTokenHash = hashToken(emailToken);
    await authRepo.createEmailVerificationToken(
      userRow.id,
      emailTokenHash,
      addHours(EMAIL_VERIFICATION_EXPIRY_HOURS)
    );

    // In production, send emailToken via email service
    // For now, log it in development
    if (process.env['NODE_ENV'] !== 'production') {
      console.log(`[DEV] Email verification token for ${userRow.email}: ${emailToken}`);
    }

    // Generate auth tokens
    const tokens = await this.generateAuthTokens(userRow.id, userRow.email, userRow.username);

    return {
      user: toUserPublic(userRow),
      ...tokens,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const userRow = await authRepo.findByEmail(input.email.toLowerCase());
    if (!userRow) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const isValid = await verifyPassword(userRow.password_hash, input.password);
    if (!isValid) {
      throw createHttpError(401, 'Invalid email or password');
    }

    // Update last active timestamp
    await authRepo.updateLastActive(userRow.id);

    // Generate auth tokens
    const tokens = await this.generateAuthTokens(userRow.id, userRow.email, userRow.username);

    return {
      user: toUserPublic(userRow),
      ...tokens,
    };
  }

  async refreshToken(refreshTokenRaw: string): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenHash = hashToken(refreshTokenRaw);
    const tokenRow = await authRepo.findRefreshToken(tokenHash);

    if (!tokenRow) {
      throw createHttpError(401, 'Invalid or expired refresh token');
    }

    // Revoke old refresh token (token rotation)
    await authRepo.revokeRefreshToken(tokenRow.id);

    // Verify user still exists
    const userRow = await authRepo.findById(tokenRow.user_id);
    if (!userRow) {
      throw createHttpError(401, 'User no longer exists');
    }

    // Update last active
    await authRepo.updateLastActive(userRow.id);

    // Generate new token pair
    return this.generateAuthTokens(userRow.id, userRow.email, userRow.username);
  }

  async logout(refreshTokenRaw: string): Promise<void> {
    const tokenHash = hashToken(refreshTokenRaw);
    const tokenRow = await authRepo.findRefreshToken(tokenHash);

    if (tokenRow) {
      await authRepo.revokeRefreshToken(tokenRow.id);
    }
    // Silently succeed even if token not found (idempotent)
  }

  async forgotPassword(email: string): Promise<void> {
    const userRow = await authRepo.findByEmail(email.toLowerCase());

    // Always return success to prevent email enumeration
    if (!userRow) {
      return;
    }

    const token = generateToken();
    const tokenHash = hashToken(token);
    await authRepo.createPasswordResetToken(
      userRow.id,
      tokenHash,
      addHours(PASSWORD_RESET_EXPIRY_HOURS)
    );

    // In production, send token via email
    if (process.env['NODE_ENV'] !== 'production') {
      console.log(`[DEV] Password reset token for ${userRow.email}: ${token}`);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = hashToken(token);
    const tokenRow = await authRepo.findPasswordResetToken(tokenHash);

    if (!tokenRow) {
      throw createHttpError(400, 'Invalid or expired password reset token');
    }

    // Hash new password and update
    const passwordHash = await hashPassword(newPassword);
    await authRepo.updatePassword(tokenRow.user_id, passwordHash);

    // Mark token as used
    await authRepo.markPasswordResetUsed(tokenRow.id);

    // Revoke all existing refresh tokens for security
    await authRepo.revokeAllUserTokens(tokenRow.user_id);
  }

  async verifyEmail(token: string): Promise<void> {
    const tokenHash = hashToken(token);
    const tokenRow = await authRepo.findEmailVerificationToken(tokenHash);

    if (!tokenRow) {
      throw createHttpError(400, 'Invalid or expired verification token');
    }

    // Update user verification status
    await authRepo.updateVerificationStatus(tokenRow.user_id, 'email');

    // Mark token as used
    await authRepo.markEmailVerificationUsed(tokenRow.id);
  }

  async getMe(userId: string): Promise<UserPublic> {
    const userRow = await authRepo.findById(userId);
    if (!userRow) {
      throw createHttpError(404, 'User not found');
    }

    await authRepo.updateLastActive(userId);
    return toUserPublic(userRow);
  }

  // ── Private Helpers ──────────────────────────────────────

  private async generateAuthTokens(
    userId: string,
    email: string,
    username: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: TokenPayload = {
      sub: userId,
      email,
      username,
    };

    const accessToken = this.fastify.jwt.sign(payload);

    // Generate and store refresh token
    const refreshTokenRaw = generateToken();
    const refreshTokenHash = hashToken(refreshTokenRaw);
    await authRepo.createRefreshToken(
      userId,
      refreshTokenHash,
      addDays(REFRESH_TOKEN_EXPIRY_DAYS)
    );

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
    };
  }
}

// ── Error Helper ───────────────────────────────────────────

interface HttpError extends Error {
  statusCode: number;
}

function createHttpError(statusCode: number, message: string): HttpError {
  const error = new Error(message) as HttpError;
  error.statusCode = statusCode;
  return error;
}
