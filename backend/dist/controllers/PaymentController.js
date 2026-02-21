"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const PaymentService_1 = __importDefault(require("../services/PaymentService"));
const BookingService_1 = __importDefault(require("../services/BookingService"));
class PaymentController {
}
exports.PaymentController = PaymentController;
_a = PaymentController;
PaymentController.payBooking = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.ApiError)('Not authenticated', 401);
    const { bookingId } = req.body;
    if (!bookingId)
        throw (0, errorHandler_1.ApiError)('bookingId is required', 400);
    const booking = await BookingService_1.default.getById(bookingId);
    if (!booking)
        throw (0, errorHandler_1.ApiError)('Booking not found', 404);
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && String(booking.user_id) !== req.user.id) {
        throw (0, errorHandler_1.ApiError)('Insufficient permissions', 403);
    }
    const updated = await PaymentService_1.default.markBookingPaid(bookingId);
    if (!updated)
        throw (0, errorHandler_1.ApiError)('Failed to update booking', 500);
    res.status(200).json({ message: 'Booking paid', data: { booking: updated } });
});
PaymentController.pixPayment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.ApiError)('Not authenticated', 401);
    const { bookingId } = req.body;
    if (!bookingId)
        throw (0, errorHandler_1.ApiError)('bookingId is required', 400);
    const booking = await BookingService_1.default.getById(bookingId);
    if (!booking)
        throw (0, errorHandler_1.ApiError)('Booking not found', 404);
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && req.user.role !== 'customer') {
        throw (0, errorHandler_1.ApiError)('Only customers and staff can make payments', 403);
    }
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && String(booking.user_id) !== req.user.id) {
        throw (0, errorHandler_1.ApiError)('Insufficient permissions', 403);
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
PaymentController.confirmPixPayment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.ApiError)('Not authenticated', 401);
    const { bookingId } = req.body;
    if (!bookingId)
        throw (0, errorHandler_1.ApiError)('bookingId is required', 400);
    const booking = await BookingService_1.default.getById(bookingId);
    if (!booking)
        throw (0, errorHandler_1.ApiError)('Booking not found', 404);
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && String(booking.user_id) !== req.user.id) {
        throw (0, errorHandler_1.ApiError)('Insufficient permissions', 403);
    }
    if (booking.status === 'confirmed') {
        throw (0, errorHandler_1.ApiError)('Booking already paid', 400);
    }
    const updated = await PaymentService_1.default.markBookingPaid(bookingId);
    if (!updated)
        throw (0, errorHandler_1.ApiError)('Failed to update booking', 500);
    res.status(200).json({ message: 'PIX payment confirmed', data: { booking: updated } });
});
PaymentController.checkout = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.user)
        throw (0, errorHandler_1.ApiError)('Not authenticated', 401);
    const { bookingId } = req.body;
    if (!bookingId)
        throw (0, errorHandler_1.ApiError)('bookingId is required', 400);
    const booking = await BookingService_1.default.getById(bookingId);
    if (!booking)
        throw (0, errorHandler_1.ApiError)('Booking not found', 404);
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && String(booking.user_id) !== req.user.id) {
        throw (0, errorHandler_1.ApiError)('Insufficient permissions', 403);
    }
    // When Stripe is not configured, fallback to direct payment
    const updated = await PaymentService_1.default.markBookingPaid(bookingId);
    if (!updated)
        throw (0, errorHandler_1.ApiError)('Failed to update booking', 500);
    res.status(200).json({
        message: 'Payment processed (fallback mode)',
        data: { booking: updated }
    });
});
PaymentController.webhook = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const event = req.body;
    // Handle Stripe webhook events
    if (event.type === 'checkout.session.completed') {
        const bookingId = event.data?.object?.metadata?.bookingId;
        if (bookingId) {
            const updated = await PaymentService_1.default.markBookingPaid(bookingId);
            if (!updated) {
                console.error('Failed to update booking payment status');
                res.status(500).json({ error: 'Failed to process payment' });
                return;
            }
        }
    }
    res.status(200).json({ received: true });
});
exports.default = PaymentController;
//# sourceMappingURL=PaymentController.js.map