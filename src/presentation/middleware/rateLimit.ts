import rateLimit from 'express-rate-limit';

export const createRateLimit = (maxRequests: number, windowMs: number, message?: string) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      error: message || `Too many requests. Please try again later.`,
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const generalRateLimit = createRateLimit(100, 15 * 60 * 1000); 

export const authRateLimit = createRateLimit(5, 15 * 60 * 1000, 'Too many authentication attempts. Please try again later.');

export const strictRateLimit = createRateLimit(10, 60 * 1000);