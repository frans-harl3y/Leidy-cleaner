"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PaymentController_1 = __importDefault(require("../controllers/PaymentController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticateToken, PaymentController_1.default.payBooking);
router.post('/pix', auth_1.authenticateToken, PaymentController_1.default.pixPayment);
router.post('/pix/confirm', auth_1.authenticateToken, PaymentController_1.default.confirmPixPayment);
router.post('/checkout', auth_1.authenticateToken, PaymentController_1.default.checkout);
router.post('/webhook', PaymentController_1.default.webhook);
exports.default = router;
//# sourceMappingURL=payments.js.map