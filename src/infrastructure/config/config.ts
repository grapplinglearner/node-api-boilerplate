import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',

  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/warehouse_db',

  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@warehouse.com',

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),

  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '10'),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100'),

  CACHE_TTL_PRODUCTS: parseInt(process.env.CACHE_TTL_PRODUCTS || '300'),
  CACHE_TTL_WAREHOUSES: parseInt(process.env.CACHE_TTL_WAREHOUSES || '300'),
  CACHE_TTL_TRANSFERS: parseInt(process.env.CACHE_TTL_TRANSFERS || '60'),
  METRICS_ENABLED: process.env.METRICS_ENABLED === 'true' || false,

  DEFAULT_API_VERSION: process.env.DEFAULT_API_VERSION || 'v1',
};