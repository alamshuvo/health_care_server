import express from 'express';
import { patientController } from './patient.controller';
const router = express.Router();
router.get("/",patientController.getAllFromDB)
router.get("/:id", patientController.getOnePatientFromDB)
router.patch("/:id",patientController.updatePatient)
router.delete("/:id",patientController.deleteFromDB) // healthData database e jodi na takhe tahole error dicche
router.delete("/soft/:id",patientController.softDelete)

export const patientRoutes =  router;