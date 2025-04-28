import express from 'express';
import { patientController } from './patient.controller';
const router = express.Router();
router.get("/",patientController.getAllFromDB)
router.get("/:id", patientController.getOnePatientFromDB)
router.patch("/:id",patientController.updatePatient)

export const patientRoutes =  router;