/**
 * Input Validator - Validação centralizada de entrada
 * Garante que todos os dados de entrada sejam validados antes do processamento
 */

class InputValidator {
  /**
   * Validar um objeto contra um schema
   * @param {Object} data - Dados para validar
   * @param {Object} schema - Schema de validação
   * @returns {Object} {valid: boolean, errors: Array}
   */
  static validate(data, schema) {
    const errors = [];

    Object.entries(schema).forEach(([field, rules]) => {
      const value = data[field];
      const fieldErrors = this.validateField(field, value, rules);
      errors.push(...fieldErrors);
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validar um campo individual
   * @param {string} field - Nome do campo
   * @param {*} value - Valor do campo
   * @param {Object} rules - Regras de validação
   * @returns {Array} Array de erros
   */
  static validateField(field, value, rules = {}) {
    const errors = [];

    // Verificar obrigatório
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: `${field} é obrigatório`,
        code: 'REQUIRED'
      });
      return errors; // Não continuar validação se obrigatório e vazio
    }

    // Se não obrigatório e vazio, não validar
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return errors;
    }

    // Validar tipo
    if (rules.type) {
      const typeCheck = this.validateType(value, rules.type);
      if (!typeCheck.valid) {
        errors.push({
          field,
          message: typeCheck.message,
          code: 'TYPE_ERROR'
        });
        return errors;
      }
    }

    // Validar comprimento (strings)
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push({
          field,
          message: `${field} deve ter no mínimo ${rules.minLength} caracteres`,
          code: 'MIN_LENGTH'
        });
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push({
          field,
          message: `${field} deve ter no máximo ${rules.maxLength} caracteres`,
          code: 'MAX_LENGTH'
        });
      }

      // Validar padrão
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push({
          field,
          message: rules.patternMessage || `${field} tem formato inválido`,
          code: 'PATTERN_ERROR'
        });
      }

      // Validar enum
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({
          field,
          message: `${field} deve ser um de: ${rules.enum.join(', ')}`,
          code: 'ENUM_ERROR'
        });
      }
    }

    // Validar números
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push({
          field,
          message: `${field} deve ser no mínimo ${rules.min}`,
          code: 'MIN_VALUE'
        });
      }

      if (rules.max !== undefined && value > rules.max) {
        errors.push({
          field,
          message: `${field} deve ser no máximo ${rules.max}`,
          code: 'MAX_VALUE'
        });
      }
    }

    // Validar arrays
    if (Array.isArray(value)) {
      if (rules.minItems && value.length < rules.minItems) {
        errors.push({
          field,
          message: `${field} deve ter no mínimo ${rules.minItems} itens`,
          code: 'MIN_ITEMS'
        });
      }

      if (rules.maxItems && value.length > rules.maxItems) {
        errors.push({
          field,
          message: `${field} deve ter no máximo ${rules.maxItems} itens`,
          code: 'MAX_ITEMS'
        });
      }

      // Validar tipo de itens
      if (rules.itemType) {
        value.forEach((item, index) => {
          const itemTypeCheck = this.validateType(item, rules.itemType);
          if (!itemTypeCheck.valid) {
            errors.push({
              field: `${field}[${index}]`,
              message: itemTypeCheck.message,
              code: 'ITEM_TYPE_ERROR'
            });
          }
        });
      }
    }

    // Custom validator
    if (rules.custom && typeof rules.custom === 'function') {
      const customResult = rules.custom(value, field);
      if (customResult !== true) {
        errors.push({
          field,
          message: customResult || `${field} é inválido`,
          code: 'CUSTOM_ERROR'
        });
      }
    }

    return errors;
  }

  /**
   * Validar tipo de dados
   * @param {*} value - Valor para validar
   * @param {string|Array} types - Tipos esperados
   * @returns {Object} {valid: boolean, message: string}
   */
  static validateType(value, types) {
    const typesList = Array.isArray(types) ? types : [types];
    const valueType = Array.isArray(value) ? 'array' : typeof value;

    const validType = typesList.some(type => {
      if (type === 'string') return typeof value === 'string';
      if (type === 'number') return typeof value === 'number';
      if (type === 'boolean') return typeof value === 'boolean';
      if (type === 'array') return Array.isArray(value);
      if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
      if (type === 'email') return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (type === 'uuid') return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
      if (type === 'url') return typeof value === 'string' && /^https?:\/\/.+/.test(value);
      if (type === 'date') return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));
      if (type === 'integer') return Number.isInteger(value);
      return false;
    });

    if (!validType) {
      return {
        valid: false,
        message: `Tipo deve ser ${typesList.join(' ou ')}, recebido ${valueType}`
      };
    }

    return { valid: true };
  }

  /**
   * Sanitizar dados
   * @param {Object} data - Dados para sanitizar
   * @param {Object} schema - Schema com rules de sanitização
   * @returns {Object} Dados sanitizados
   */
  static sanitize(data, schema = {}) {
    const sanitized = JSON.parse(JSON.stringify(data));

    Object.entries(sanitized).forEach(([field, value]) => {
      const rules = schema[field] || {};

      if (typeof value === 'string') {
        // Remover espaços em branco
        if (rules.trim !== false) {
          sanitized[field] = value.trim();
        }

        // Remover caracteres especiais
        if (rules.removeSpecialChars) {
          sanitized[field] = value.replace(/[^\w\s\-@\.]/g, '');
        }

        // Lowercase
        if (rules.lowercase) {
          sanitized[field] = value.toLowerCase();
        }

        // Uppercase
        if (rules.uppercase) {
          sanitized[field] = value.toUpperCase();
        }

        // Remover HTML
        if (rules.stripHTML !== false && (rules.type === 'string' || !rules.type)) {
          sanitized[field] = this.stripHTML(value);
        }
      }

      // Converter tipo se necessário
      if (rules.type === 'number' && typeof value === 'string') {
        sanitized[field] = parseInt(value) || parseFloat(value);
      }

      if (rules.type === 'boolean' && typeof value === 'string') {
        sanitized[field] = value.toLowerCase() === 'true' || value === '1';
      }
    });

    return sanitized;
  }

  /**
   * Remover tags HTML
   * @param {string} str - String com possível HTML
   * @returns {string} String limpa
   */
  static stripHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }

  /**
   * Criar schemas de validação padrão
   */
  static schemas = {
    email: {
      type: 'email',
      required: true,
      maxLength: 255
    },

    password: {
      type: 'string',
      required: true,
      minLength: 8,
      patternMessage: 'Senha deve conter letras, números e caracteres especiais'
    },

    uuid: {
      type: 'uuid',
      required: true
    },

    url: {
      type: 'url',
      required: true
    },

    phone: {
      type: 'string',
      required: true,
      pattern: /^[0-9\-\(\)\s\+]{10,}$/,
      patternMessage: 'Número de telefone inválido'
    },

    cpf: {
      type: 'string',
      required: true,
      pattern: /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/,
      patternMessage: 'CPF deve estar no formato XXX.XXX.XXX-XX'
    },

    positiveInteger: {
      type: 'integer',
      required: true,
      min: 1
    },

    nonNegativeInteger: {
      type: 'integer',
      required: true,
      min: 0
    }
  };
}

module.exports = InputValidator;
