/**
 * Input Validation Helper
 * Provides strict validation for API requests
 */

const logger = require('../utils/logger');

class InputValidator {
  /**
   * Validates email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  }

  /**
   * Validates phone format (Brazil)
   */
  static isValidPhone(phone) {
    const phoneRegex = /^(\+55)?[ -]?(\(?\d{2}\)?)?[ -]?\d{4,5}[ -]?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  /**
   * Validates string length
   */
  static isValidString(str, minLength = 1, maxLength = 1000) {
    if (typeof str !== 'string') return false;
    return str.length >= minLength && str.length <= maxLength;
  }

  /**
   * Validates number is in range
   */
  static isValidNumber(num, min = 0, max = Number.MAX_SAFE_INTEGER) {
    return Number.isFinite(num) && num >= min && num <= max;
  }

  /**
   * Sanitizes string input (removes malicious characters)
   */
  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str
      .trim()
      .replace(/[<>\"'`]/g, '') // Remove HTML chars
      .slice(0, 1000); // Max 1000 chars
  }

  /**
   * Sanitizes object recursively
   */
  static sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'string') {
          sanitized[key] = this.sanitizeString(value);
        } else if (typeof value === 'object') {
          sanitized[key] = this.sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  }

  /**
   * Validates ID is numeric
   */
  static isValidId(id) {
    return Number.isInteger(parseInt(id)) && parseInt(id) > 0;
  }

  /**
   * Validates date is in past or future
   */
  static isValidDate(dateStr, requireFuture = false) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return false;
    
    if (requireFuture) {
      return date > new Date();
    }
    
    return true;
  }

  /**
   * Validates and sanitizes request body
   */
  static validateRequest(data, schema) {
    try {
      const errors = [];
      
      for (const [field, rules] of Object.entries(schema)) {
        const value = data[field];
        
        // Check required
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          continue;
        }
        
        // Skip if not required and empty
        if (!rules.required && (value === undefined || value === null)) {
          continue;
        }
        
        // Check type
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
          continue;
        }
        
        // Custom validator
        if (rules.validator && !rules.validator(value)) {
          errors.push(`${field} is invalid`);
        }
      }
      
      if (errors.length > 0) {
        return {
          valid: false,
          errors,
          message: `Validation failed: ${errors.join(', ')}`
        };
      }
      
      return { valid: true };
    } catch (err) {
      logger.error('Validation error', { error: err.message });
      return {
        valid: false,
        errors: ['Internal validation error'],
        message: 'Validation error occurred'
      };
    }
  }
}

module.exports = InputValidator;
