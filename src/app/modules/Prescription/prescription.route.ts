import express from 'express';
import { prescriptionController } from './prescription.controller';
import auth from '../../middlewares/authMiddleware';
import { userRole } from '@prisma/client';
const route = express.Router();
route.get("/my-prescription",auth(userRole.PATIENT),prescriptionController.patientPrescription)
route.post("/",auth(userRole.DOCTOR),prescriptionController.insertIntoDb)
export const PrescriptionRoutes = route