import express from 'express';
import { paymentController } from './payment.controllers';
const router = express.Router();
router.post("/init-payment/:appointmentId",paymentController.initPayment)

export const paymentRoutes = router;