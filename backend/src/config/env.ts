import 'dotenv/config';

interface EnvConfig {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  COOKIE_SECRET: string;
  PORT: number;
  CORS_ORIGIN: string;
  NODE_ENV: string;
  REDIS_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  EXPO_ACCESS_TOKEN: string;
}

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function loadConfig(): EnvConfig {
  return {
    DATABASE_URL: requireEnv('DATABASE_URL'),
    JWT_SECRET: requireEnv('JWT_SECRET'),
    JWT_REFRESH_SECRET: requireEnv('JWT_REFRESH_SECRET'),
    COOKIE_SECRET: requireEnv('COOKIE_SECRET'),
    PORT: parseInt(process.env['PORT'] || '3000', 10),
    CORS_ORIGIN: process.env['CORS_ORIGIN'] || 'http://localhost:5173',
    NODE_ENV: process.env['NODE_ENV'] || 'development',
    REDIS_URL: process.env['REDIS_URL'] || 'redis://localhost:6379',
    STRIPE_SECRET_KEY: process.env['STRIPE_SECRET_KEY'] || '',
    STRIPE_WEBHOOK_SECRET: process.env['STRIPE_WEBHOOK_SECRET'] || '',
    EXPO_ACCESS_TOKEN: process.env['EXPO_ACCESS_TOKEN'] || '',
  };
}

export const config = loadConfig();
