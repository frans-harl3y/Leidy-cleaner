import { Response } from 'express';
import { AuthRequest } from '../middleware/errorHandler';
export declare class PaymentController {
    static payBooking: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    static pixPayment: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    static confirmPixPayment: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    static checkout: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    static webhook: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
}
export default PaymentController;
//# sourceMappingURL=PaymentController.d.ts.map