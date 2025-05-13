import express from 'express';
import { paymentController } from './payment.controllers';
const router = express.Router();
router.get("/ipn",paymentController.validatePayment)
router.post("/init-payment/:appointmentId",paymentController.initPayment);


export const paymentRoutes = router;