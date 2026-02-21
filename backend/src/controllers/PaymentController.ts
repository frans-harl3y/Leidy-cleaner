import { Response } from 'express';
import { AuthRequest, asyncHandler, ApiError } from '../middleware/errorHandler';
import PaymentService from '../services/PaymentService';
import BookingService from '../services/BookingService';

export class PaymentController {
  static payBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError('Not authenticated', 401);

    const { bookingId } = req.body;
    if (!bookingId) throw ApiError('bookingId is required', 400);

    const booking = await BookingService.getById(bookingId);
    if (!booking) throw ApiError('Booking not found', 404);

    if (req.user.role !== 'admin' && req.user.role !== 'staff' && String(booking.user_id) !== req.user.id) {
      throw ApiError('Insufficient permissions', 403);
    }

    const updated = await PaymentService.markBookingPaid(bookingId);
    if (!updated) throw ApiError('Failed to update booking', 500);

    res.status(200).json({ message: 'Booking paid', data: { booking: updated } });
  });

  static pixPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError('Not authenticated', 401);

    const { bookingId } = req.body;
    if (!bookingId) throw ApiError('bookingId is required', 400);

    const booking = await BookingService.getById(bookingId);
    if (!booking) throw ApiError('Booking not found', 404);

    if (req.user.role !== 'admin' && req.user.role !== 'staff' && req.user.role !== 'customer') {
      throw ApiError('Only customers and staff can make payments', 403);
    }

    if (req.user.role !== 'admin' && req.user.role !== 'staff' && String(booking.user_id) !== req.user.id) {
      throw ApiError('Insufficient permissions', 403);
    }

    const pixData = {
      pixKey: '51980330422',
      amount: booking.total_price,
      description: `Pagamento agendamento ${booking.id}`,
      bookingId: booking.id
    };

    res.status(200).json({
      message: 'PIX payment data generated',
      data: pixData
    });
  });

  static confirmPixPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError('Not authenticated', 401);

    const { bookingId } = req.body;
    if (!bookingId) throw ApiError('bookingId is required', 400);

    const booking = await BookingService.getById(bookingId);
    if (!booking) throw ApiError('Booking not found', 404);

    if (req.user.role !== 'admin' && req.user.role !== 'staff' && String(booking.user_id) !== req.user.id) {
      throw ApiError('Insufficient permissions', 403);
    }

    if (booking.status === 'confirmed') {
      throw ApiError('Booking already paid', 400);
    }

    const updated = await PaymentService.markBookingPaid(bookingId);
    if (!updated) throw ApiError('Failed to update booking', 500);

    res.status(200).json({ message: 'PIX payment confirmed', data: { booking: updated } });
  });

  static checkout = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw ApiError('Not authenticated', 401);

    const { bookingId } = req.body;
    if (!bookingId) throw ApiError('bookingId is required', 400);

    const booking = await BookingService.getById(bookingId);
    if (!booking) throw ApiError('Booking not found', 404);

    if (req.user.role !== 'admin' && req.user.role !== 'staff' && String(booking.user_id) !== req.user.id) {
      throw ApiError('Insufficient permissions', 403);
    }

    // When Stripe is not configured, fallback to direct payment
    const updated = await PaymentService.markBookingPaid(bookingId);
    if (!updated) throw ApiError('Failed to update booking', 500);

    res.status(200).json({
      message: 'Payment processed (fallback mode)',
      data: { booking: updated }
    });
  });

  static webhook = asyncHandler(async (req: AuthRequest, res: Response) => {
    const event = req.body;

    // Handle Stripe webhook events
    if (event.type === 'checkout.session.completed') {
      const bookingId = event.data?.object?.metadata?.bookingId;
      if (bookingId) {
        const updated = await PaymentService.markBookingPaid(bookingId);
        if (!updated) {
          console.error('Failed to update booking payment status');
          res.status(500).json({ error: 'Failed to process payment' });
          return;
        }
      }
    }

    res.status(200).json({ received: true });
  });
}

export default PaymentController;
