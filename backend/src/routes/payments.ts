import { Router } from 'express';
import PaymentController from '../controllers/PaymentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, PaymentController.payBooking);
router.post('/pix', authenticateToken, PaymentController.pixPayment);
router.post('/pix/confirm', authenticateToken, PaymentController.confirmPixPayment);
router.post('/checkout', authenticateToken, PaymentController.checkout);
router.post('/webhook', PaymentController.webhook);

export default router;
