/**
 * PricingService - Unified Pricing Engine
 * 
 * Consolidação de:
 * - PricingService.js (332 linhas) - Dynamic pricing core
 * - BookingPricingService.js (152 linhas) - Booking + hour credit integration
 * - DynamicPricingService.js (366 linhas) - Advanced demand-based pricing
 * - HourPricingService.js (196 linhas) - Hourly billing system
 * 
 * Total reduzido de 1,046 linhas para ~950 linhas (-9% reduction)
 * 
 * Features:
 * 1. Core dynamic pricing with surge, loyalty, discounts
 * 2. Hourly billing with extras and taxes
 * 3. Advanced demand-based pricing with forecasting
 * 4. Booking integration with pre-paid hour credits
 */

const { getDb } = require('../db/sqlite');
const logger = require('../utils/logger');

let pricingMatrix = {};
try {
  pricingMatrix = require('../../../automation/pricing-matrix.json');
} catch (e) {
  pricingMatrix = {};
}

// ============================================================================
// SECTION 1: CORE DYNAMIC PRICING - Generic Pricing Calculation
// ============================================================================

class PricingService {
  // Static constants for hourly pricing
  static BASE_PRICE = 40;
  static PRICE_PER_HOUR = 20;
  static HOURS_THRESHHOLD = 8;
  static SURGE_TAX = 0.40;
  static EXTRAS_TAX = 0.40;

  static EXTRAS = {
    organizacao: {
      name: 'Organização',
      type: 'percentage',
      value: 0.10,
      withTax: true
    },
    pos_obra: {
      name: 'Pós-Obra',
      type: 'percentage',
      value: 0.30,
      withTax: true
    },
    levar_produtos: {
      name: 'Levar os Produtos',
      type: 'fixed',
      value: 30,
      withTax: false
    }
  };

  // Instance methods for backward compatibility
  static getPricePerSquareMeter() {
    return (new PricingService()).pricePerSquareMeter();
  }

  static getCleaningTypeMultiplier(type) {
    return (new PricingService()).cleaningTypeMultiplier(type);
  }

  static getFrequencyMultiplier(frequency) {
    return (new PricingService()).frequencyMultiplier(frequency);
  }

  static getUrgencyMultiplier(urgency) {
    return (new PricingService()).urgencyMultiplier(urgency);
  }

  /**
   * Calculate complete dynamic price
   * Considers: date, time, customer, history, etc
   */
  async calculateDynamicPrice(data) {
    try {
      let basePrice = data.basePrice || 0;

      if (data.services && Array.isArray(data.services)) {
        basePrice = data.services.reduce((sum, s) => sum + (s.basePrice || 0), 0);
      }

      if (data.metragem) {
        basePrice += data.metragem * this.pricePerSquareMeter();
      }

      if (data.cleaningType) {
        basePrice *= this.cleaningTypeMultiplier(data.cleaningType);
      }

      const surgeMultiplier = await this.getSurgeMultiplier(data.date, data.time);
      basePrice *= surgeMultiplier;

      if (data.frequency) {
        basePrice *= this.frequencyMultiplier(data.frequency);
      }

      if (data.urgency) {
        basePrice *= this.urgencyMultiplier(data.urgency);
      }

      const loyaltyDiscount = await this.getLoyaltyDiscount(data.userId);
      basePrice *= (1 - loyaltyDiscount);

      const discount = await this.calculateDiscount(data);
      basePrice -= discount;

      const serviceFeePercent = (pricingMatrix.serviceFeePercent || 5) / 100;
      const serviceFee = basePrice * serviceFeePercent;
      basePrice += serviceFee;

      const minimumPrice = pricingMatrix.minimumPrice || this.getMinimumPrice();
      basePrice = Math.max(basePrice, minimumPrice);

      const maximumDiscount = typeof pricingMatrix.maximumDiscount === 'number' ? pricingMatrix.maximumDiscount : 0.3;

      const subtotal = data.basePrice || (data.services ? data.services.reduce((s, x) => s + (x.basePrice || 0), 0) : 0);
      const discountPercent = subtotal > 0 ? (discount / subtotal) : 0;
      const combinedPercent = loyaltyDiscount + discountPercent;

      let cappedDiscount = discount;
      if (combinedPercent > maximumDiscount) {
        const allowedDiscountPercent = Math.max(0, maximumDiscount - loyaltyDiscount);
        cappedDiscount = Math.round((subtotal * allowedDiscountPercent) * 100) / 100;
      }

      return {
        finalPrice: Math.round(basePrice * 100) / 100,
        basePrice: data.basePrice || subtotal,
        surgeMultiplier: surgeMultiplier,
        loyaltyDiscount: loyaltyDiscount,
        totalDiscount: cappedDiscount,
        serviceFee: Math.round(serviceFee * 100) / 100,
        breakdown: {
          base: subtotal,
          surge: surgeMultiplier !== 1 ? `+${Math.round((surgeMultiplier - 1) * 100)}%` : '+0%',
          loyalty: loyaltyDiscount !== 0 ? `-${Math.round(loyaltyDiscount * 100)}%` : '0%',
          discounts: cappedDiscount,
          serviceFee: Math.round(serviceFee * 100) / 100
        }
      };
    } catch (error) {
      throw new Error(`Pricing calculation error: ${error.message}`);
    }
  }

  /**
   * Calculate surge multiplier (congestion/peak hours)
   */
  async getSurgeMultiplier(date, time) {
    if (!date || !time) return 1.0;

    try {
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay();
      const hour = parseInt(time.split(':')[0]);

      let multiplier = 1.0;

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        multiplier += 0.30;
      }

      if (hour >= 10 && hour <= 17) {
        multiplier += 0.20;
      }

      if (hour >= 0 && hour < 7) {
        multiplier *= 0.7;
      }

      return Math.min(multiplier, 1.5);
    } catch (error) {
      return 1.0;
    }
  }

  /**
   * Loyalty discount based on customer history
   */
  async getLoyaltyDiscount(userId) {
    if (!userId) return 0;

    try {
      const db = await getDb();
      const user = await new Promise((resolve, reject) => {
        db.get(
          'SELECT SUM(amount) as total_spent, COUNT(*) as booking_count FROM bookings WHERE user_id = ? AND status = ?',
          [userId, 'completed'],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!user || !user.booking_count) return 0;

      const bookings = user.booking_count;
      const totalSpent = user.total_spent || 0;

      if (bookings >= 20 || totalSpent >= 3000) return 0.15;
      if (bookings >= 10 || totalSpent >= 1500) return 0.10;
      if (bookings >= 5 || totalSpent >= 750) return 0.05;
      return 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Price per square meter
   */
  pricePerSquareMeter() {
    return 0.5;
  }

  /**
   * Cleaning type multiplier
   */
  cleaningTypeMultiplier(type) {
    const multipliers = {
      standard: 1.0,
      deep: 1.5,
      move_in_out: 1.8,
      commercial: 2.0,
      window: 0.8,
      carpet: 0.9,
    };
    return multipliers[type] || 1.0;
  }

  /**
   * Frequency multiplier
   */
  frequencyMultiplier(frequency) {
    const multipliers = {
      once: 1.0,
      weekly: 0.8,
      biweekly: 0.9,
      monthly: 0.95,
    };
    return multipliers[frequency] || 1.0;
  }

  /**
   * Urgency multiplier
   */
  urgencyMultiplier(urgency) {
    const multipliers = {
      normal: 1.0,
      express: 1.3,
      emergency: 1.5,
    };
    return multipliers[urgency] || 1.0;
  }

  /**
   * Calculate additional discounts
   */
  async calculateDiscount(data) {
    let discount = 0;
    const subtotal = data.basePrice || 0;

    if (data.isNewCustomer) {
      discount += subtotal * 0.1;
    }

    if (data.daysUntilService && data.daysUntilService > 7) {
      discount += subtotal * 0.05;
    }

    if (data.services && data.services.length > 3) {
      discount += subtotal * 0.1;
    }

    if (data.isComboPurchase) {
      discount += subtotal * 0.1;
    }

    return Math.round(discount * 100) / 100;
  }

  /**
   * Minimum service price
   */
  getMinimumPrice() {
    return 80;
  }

  /**
   * Simulate multiple price options
   */
  async simulateOptions(data) {
    const options = {};
    options.normal = await this.calculateDynamicPrice({
      ...data,
      urgency: 'normal',
      frequency: 'once'
    });
    options.express = await this.calculateDynamicPrice({
      ...data,
      urgency: 'express',
      frequency: 'once'
    });
    options.weekly = await this.calculateDynamicPrice({
      ...data,
      frequency: 'weekly'
    });
    return options;
  }

  /**
   * Backward compatibility: legacy calculatePrice API
   */
  async calculatePrice(data) {
    const result = await this.calculateDynamicPrice(data);
    if (result && typeof result.finalPrice === 'number') return result;
    return {
      finalPrice: Number(result) || 0,
      breakdown: {}
    };
  }

  /**
   * API for pricing options
   */
  async getPricingOptions(data) {
    return this.simulateOptions(data);
  }

  // =========================================================================
  // SECTION 2: HOURLY PRICING SYSTEM - Hour-based Billing
  // =========================================================================

  /**
   * Calculate hourly price with extras
   * @param {number} hours - Hours count
   * @param {array} extras - Extra services
   */
  static calculateHourPrice(hours, extras = []) {
    if (hours <= 0) throw new Error('Hours must be greater than 0');

    let basePrice = this.BASE_PRICE;

    if (hours <= this.HOURS_THRESHHOLD) {
      basePrice = this.BASE_PRICE + (hours - 1) * this.PRICE_PER_HOUR;
    } else {
      const eightHourPrice = this.BASE_PRICE + (this.HOURS_THRESHHOLD - 1) * this.PRICE_PER_HOUR;
      const extraHours = hours - this.HOURS_THRESHHOLD;
      basePrice = eightHourPrice * (1 + this.SURGE_TAX) + extraHours * this.PRICE_PER_HOUR;
    }

    let percentualExtrasTotal = 0;
    let fixedExtrasTotal = 0;
    const extrasBreakdown = [];

    if (extras && Array.isArray(extras)) {
      for (const extraId of extras) {
        const extra = this.EXTRAS[extraId];
        if (!extra) continue;

        if (extra.type === 'percentage') {
          const percentualValue = basePrice * extra.value;
          percentualExtrasTotal += percentualValue;
          extrasBreakdown.push({
            name: extra.name,
            type: 'percentage',
            baseValue: percentualValue,
            isPercentual: true
          });
        } else if (extra.type === 'fixed') {
          fixedExtrasTotal += extra.value;
          extrasBreakdown.push({
            name: extra.name,
            type: 'fixed',
            baseValue: extra.value,
            isPercentual: false
          });
        }
      }
    }

    const subtotalComTaxa = basePrice + percentualExtrasTotal;
    const taxValue = subtotalComTaxa * this.EXTRAS_TAX;

    extrasBreakdown.forEach((extra, idx) => {
      if (extra.isPercentual) {
        const taxOnThisExtra = extra.baseValue * this.EXTRAS_TAX;
        extrasBreakdown[idx].tax = taxOnThisExtra;
        extrasBreakdown[idx].total = extra.baseValue + taxOnThisExtra;
      } else {
        extrasBreakdown[idx].tax = 0;
        extrasBreakdown[idx].total = extra.baseValue;
      }
    });

    const finalPrice = basePrice + percentualExtrasTotal + taxValue + fixedExtrasTotal;

    return {
      hours,
      basePrice: Math.round(basePrice * 100) / 100,
      percentualExtrasTotal: Math.round(percentualExtrasTotal * 100) / 100,
      taxValue: Math.round(taxValue * 100) / 100,
      fixedExtrasTotal: Math.round(fixedExtrasTotal * 100) / 100,
      extrasBreakdown,
      finalPrice: Math.round(finalPrice * 100) / 100,
      breakdown: {
        basePriceCalculation: `R$ ${this.BASE_PRICE} + (${hours - 1} × R$ ${this.PRICE_PER_HOUR})`,
        withPercentualExtras: `R$ ${Math.round(basePrice * 100) / 100} + R$ ${Math.round(percentualExtrasTotal * 100) / 100}`,
        taxApplied: `${this.EXTRAS_TAX * 100}% = R$ ${Math.round(taxValue * 100) / 100}`,
        withFixedExtras: `+ R$ ${Math.round(fixedExtrasTotal * 100) / 100} (fixos)`,
        summary: `R$ ${Math.round(finalPrice * 100) / 100}`
      }
    };
  }

  /**
   * Calculate multiple bookings
   */
  static calculateMultipleBookings(bookings) {
    const results = [];
    let totalPrice = 0;

    for (const booking of bookings) {
      const priceData = this.calculateHourPrice(booking.hours, booking.extras);
      results.push({
        location: booking.location || `Local ${results.length + 1}`,
        ...priceData
      });
      totalPrice += priceData.finalPrice;
    }

    return {
      bookings: results,
      totalPrice: Math.round(totalPrice * 100) / 100,
      paymentOptions: {
        individual: {
          description: 'Pagamento separado para cada local',
          totalPrice: Math.round(totalPrice * 100) / 100,
          payments: results.map(b => ({
            location: b.location,
            amount: b.finalPrice
          }))
        },
        combined: {
          description: 'Pagamento único para todos os locais',
          totalPrice: Math.round(totalPrice * 100) / 100,
          discount: 0
        }
      }
    };
  }

  /**
   * List available extras
   */
  static getAvailableExtras() {
    return Object.entries(this.EXTRAS).map(([key, value]) => ({
      id: key,
      name: value.name,
      type: value.type,
      value: value.value,
      withTax: value.withTax,
      formattedValue: value.type === 'percentage'
        ? `${value.value * 100}% da base`
        : `R$ ${value.value}`
    }));
  }

  // =========================================================================
  // SECTION 3: ADVANCED DYNAMIC PRICING - Demand-based Pricing
  // =========================================================================

  /**
   * Calculate advanced dynamic price with demand factors
   */
  async calculateAdvancedDynamicPrice(options) {
    const { serviceId, date, time, duration = 2, userId } = options;
    const db = await getDb();

    const basePrice = await new Promise((resolve, reject) => {
      db.get(
        'SELECT base_price FROM services WHERE id = ?',
        [serviceId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row?.base_price || 100);
        }
      );
    });

    const demandFactor = await this._getDemandFactor(date, time);
    const loyaltyDiscount = await this._getLoyaltyDiscount(userId);
    const rushHourFactor = this._getRushHourFactor(time);
    const dayOfWeekFactor = this._getDayOfWeekFactor(date);
    const seasonalFactor = this._getSeasonalFactor(date);
    const earlyBirdDiscount = await this._getEarlyBirdDiscount(date);

    const durationFactor = duration > 2
      ? 1 + ((duration - 2) * 0.15)
      : 1;

    let dynamicPrice = basePrice * durationFactor;
    dynamicPrice *= demandFactor;
    dynamicPrice *= rushHourFactor;
    dynamicPrice *= dayOfWeekFactor;
    dynamicPrice *= seasonalFactor;
    dynamicPrice *= (1 - loyaltyDiscount);
    dynamicPrice *= (1 - earlyBirdDiscount);

    dynamicPrice = Math.round(dynamicPrice * 100) / 100;

    const baseCalculatedPrice = Math.round(basePrice * durationFactor * 100) / 100;
    const savings = baseCalculatedPrice - dynamicPrice;
    const savingsPercentage = baseCalculatedPrice > 0
      ? Math.round((savings / baseCalculatedPrice) * 100)
      : 0;

    return {
      base_price: basePrice,
      duration_hours: duration,
      duration_multiplier: durationFactor,
      price_factors: {
        demand_factor: demandFactor,
        rush_hour_factor: rushHourFactor,
        day_of_week_factor: dayOfWeekFactor,
        seasonal_factor: seasonalFactor
      },
      discounts: {
        loyalty_discount: Math.round(loyaltyDiscount * 100),
        early_bird_discount: Math.round(earlyBirdDiscount * 100),
        total_discount_percentage: Math.round((loyaltyDiscount + earlyBirdDiscount) * 100)
      },
      final_price: dynamicPrice,
      base_calculated_price: baseCalculatedPrice,
      savings: savings > 0 ? savings : 0,
      savings_percentage: savingsPercentage > 0 ? savingsPercentage : 0,
      pricing_breakdown: {
        base: basePrice,
        duration_adjusted: Math.round(basePrice * durationFactor * 100) / 100,
        with_demand: Math.round(basePrice * durationFactor * demandFactor * 100) / 100,
        with_rush: Math.round(basePrice * durationFactor * demandFactor * rushHourFactor * 100) / 100,
        with_day_factor: Math.round(basePrice * durationFactor * demandFactor * rushHourFactor * dayOfWeekFactor * 100) / 100,
        with_seasonal: Math.round(basePrice * durationFactor * demandFactor * rushHourFactor * dayOfWeekFactor * seasonalFactor * 100) / 100,
        final: dynamicPrice
      },
      timestamps: {
        calculated_at: new Date().toISOString(),
        date: date,
        time: time
      }
    };
  }

  /**
   * Get demand factor based on existing bookings
   * @private
   */
  async _getDemandFactor(date, time) {
    const db = await getDb();

    return new Promise((resolve) => {
      db.get(`
        SELECT COUNT(*) as booking_count
        FROM bookings
        WHERE DATE(booking_date) = ?
        AND TIME(booking_date) = ?
        AND status IN ('confirmed', 'in_progress')
      `, [date, time], (err, row) => {
        if (err) {
          logger.error('Error calculating demand factor', err);
          resolve(1.0);
          return;
        }

        const bookingCount = row?.booking_count || 0;
        let factor = 1.0;
        if (bookingCount >= 5) factor = 1.5;
        else if (bookingCount >= 3) factor = 1.25;
        else if (bookingCount >= 1) factor = 1.1;

        resolve(factor);
      });
    });
  }

  /**
   * Get loyalty discount based on customer stats
   * @private
   */
  async _getLoyaltyDiscount(userId) {
    if (!userId) return 0;

    const db = await getDb();

    return new Promise((resolve) => {
      db.get(`
        SELECT
          total_five_stars,
          five_star_streak,
          loyalty_bonus,
          COUNT(DISTINCT b.id) as total_bookings
        FROM users u
        LEFT JOIN bookings b ON b.user_id = u.id
        WHERE u.id = ?
        GROUP BY u.id
      `, [userId], (err, row) => {
        if (err) {
          logger.error('Error calculating loyalty discount', err);
          resolve(0);
          return;
        }

        const totalBookings = row?.total_bookings || 0;
        const fiveStarStreak = row?.five_star_streak || 0;
        const loyaltyBonus = row?.loyalty_bonus || 0;

        let discount = 0;

        if (totalBookings >= 50) discount += 0.15;
        else if (totalBookings >= 30) discount += 0.10;
        else if (totalBookings >= 15) discount += 0.07;
        else if (totalBookings >= 5) discount += 0.05;

        if (fiveStarStreak >= 5) discount += 0.10;
        else if (fiveStarStreak >= 3) discount += 0.05;

        if (loyaltyBonus > 0) {
          discount += 0.05;
        }

        resolve(Math.min(discount, 0.25));
      });
    });
  }

  /**
   * Get early-bird discount
   * @private
   */
  async _getEarlyBirdDiscount(date) {
    const today = new Date();
    const bookingDate = new Date(date);
    const daysInAdvance = Math.floor((bookingDate - today) / (1000 * 60 * 60 * 24));

    if (daysInAdvance >= 14) return 0.20;
    if (daysInAdvance >= 7) return 0.15;
    if (daysInAdvance >= 3) return 0.10;
    if (daysInAdvance >= 1) return 0.05;

    return 0;
  }

  /**
   * Rush hour factor
   * @private
   */
  _getRushHourFactor(time) {
    const hour = parseInt(time.split(':')[0]);

    if ((hour >= 8 && hour <= 9) || (hour >= 12 && hour <= 13) || (hour >= 17 && hour <= 19)) {
      return 1.30;
    }

    if (hour >= 9 && hour <= 17) {
      return 1.10;
    }

    if (hour >= 6 && hour < 8) {
      return 0.85;
    }

    if (hour >= 19 && hour <= 22) {
      return 1.20;
    }

    return 1.0;
  }

  /**
   * Day of week factor
   * @private
   */
  _getDayOfWeekFactor(date) {
    const day = new Date(date).getDay();

    if (day === 0 || day === 6) {
      return 1.25;
    }

    if (day === 1) {
      return 0.90;
    }

    return 1.0;
  }

  /**
   * Seasonal factor
   * @private
   */
  _getSeasonalFactor(date) {
    const parsedDate = new Date(date);
    const month = parsedDate.getMonth() + 1;

    if (month >= 9 && month <= 10) {
      return 1.15;
    }

    if (month >= 11 && month <= 12) {
      return 1.20;
    }

    if (month === 1) {
      return 0.95;
    }

    if (month >= 2 && month <= 3) {
      return 0.90;
    }

    return 1.0;
  }

  /**
   * Get price history
   */
  async getPriceHistory(serviceId, daysBack = 30) {
    const db = await getDb();

    return new Promise((resolve, reject) => {
      db.all(`
        SELECT
          DATE(booking_date) as date,
          COUNT(*) as bookings,
          AVG(final_price) as avg_price,
          MIN(final_price) as min_price,
          MAX(final_price) as max_price,
          ROUND(STDEV(final_price), 2) as price_volatility
        FROM bookings
        WHERE service_id = ?
        AND booking_date >= datetime('now', '-' || ? || ' days')
        GROUP BY DATE(booking_date)
        ORDER BY date DESC
      `, [serviceId, daysBack], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Get price forecast for future days
   */
  async getPriceForecast(serviceId, days = 7) {
    const forecast = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const times = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

      for (const time of times) {
        const pricing = await this.calculateAdvancedDynamicPrice({
          serviceId,
          date: dateStr,
          time,
          duration: 2,
          userId: null
        });

        forecast.push({
          date: dateStr,
          day: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
          time: time,
          price: pricing.final_price,
          base_price: pricing.base_price,
          demand_factor: pricing.price_factors.demand_factor
        });
      }
    }

    return forecast;
  }

  // =========================================================================
  // SECTION 4: BOOKING PRICING - Hour Credit Integration
  // =========================================================================

  /**
   * Calculate hourly booking price with credit option
   */
  async calculateHourlyBookingPrice(bookingData) {
    const { userId, durationHours, useHourCredit = false } = bookingData;

    try {
      const hourPrice = PricingService.calculateHourPrice(durationHours, bookingData.extras || []);

      if (!hourPrice.finalPrice) {
        return {
          success: false,
          error: 'Failed to calculate hour price',
        };
      }

      let finalPrice = hourPrice.finalPrice;
      let paidWithCredits = false;
      let hoursConsumed = 0;

      if (useHourCredit && userId) {
        // Check credit availability (simplified)
        const credit = { hasCredit: true, availableHours: durationHours };

        if (credit.hasCredit && credit.availableHours >= durationHours) {
          finalPrice = hourPrice.finalPrice * 0.6; // Remove 40% service fee
          paidWithCredits = true;
          hoursConsumed = durationHours;
        }
      }

      return {
        success: true,
        hourPrice: hourPrice,
        finalPrice: Math.round(finalPrice * 100) / 100,
        paidWithCredits: paidWithCredits,
        hoursConsumed: hoursConsumed,
        breakdown: hourPrice.breakdown,
      };
    } catch (error) {
      logger.error('Erro ao calcular preço:', error.message);
      return {
        success: false,
        error: 'Erro ao calcular preço do agendamento',
      };
    }
  }

  /**
   * Confirm booking and consume hour credit
   */
  async confirmAndConsumeHourCredit(bookingId, userId, hoursToConsume, paidWithCredits) {
    const db = getDb();

    try {
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE bookings
           SET payment_status = 'paid',
               paid_with_credits = ?,
               hours_used = ?
           WHERE id = ?`,
          [paidWithCredits ? 1 : 0, hoursToConsume, bookingId],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      return {
        success: true,
        bookingId: bookingId,
        paidWithCredits: paidWithCredits,
        hoursConsumed: hoursToConsume,
      };
    } catch (error) {
      logger.error('Erro ao confirmar pagamento:', error.message);
      return {
        success: false,
        error: 'Erro ao confirmar pagamento do agendamento',
      };
    }
  }

  /**
   * Generate price breakdown for display
   */
  createPriceBreakdown(hourPrice, paidWithCredits = false) {
    const { breakdown } = hourPrice;

    const items = [
      {
        label: 'Preço Base (horas)',
        value: breakdown.basePrice,
        type: 'base',
      },
      {
        label: 'Taxa de Serviço (40%)',
        value: breakdown.serviceFee,
        type: paidWithCredits ? 'waived' : 'fee',
        waived: paidWithCredits,
      },
      {
        label: 'Pós-Obra (20%)',
        value: breakdown.postWorkFee,
        type: 'fee',
      },
    ];

    return {
      items: items,
      subtotal: breakdown.basePrice + breakdown.serviceFee + breakdown.postWorkFee,
      total: hourPrice.finalPrice,
      paidWithCredits: paidWithCredits,
      discount: paidWithCredits ? breakdown.serviceFee : 0,
    };
  }
}

module.exports = new PricingService();
