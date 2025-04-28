import express from 'express';
import { patientController } from './patient.controller';
const router = express.Router();
router.get("/",patientController.getAllFromDB)



export const patientRoutes =  router;