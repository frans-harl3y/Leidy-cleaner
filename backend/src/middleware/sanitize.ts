import { Request, Response, NextFunction } from 'express';

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  // Sanitizar query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key] as string);
      }
    });
  }

  // Sanitizar body
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }

  next();
};

function sanitizeString(str: string): string {
  if (typeof str !== 'string') return str;

  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

function sanitizeObject(obj: any): void {
  if (obj === null || typeof obj !== 'object') return;

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeString(obj[key]);
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach((item: any, index: number) => {
        if (typeof item === 'string') {
          obj[key][index] = sanitizeString(item);
        } else if (typeof item === 'object') {
          sanitizeObject(item);
        }
      });
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  });
}