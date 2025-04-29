import express from 'express';
import { doctorScheduleController } from './doctorSchedule.controller';
import auth from '../../middlewares/authMiddleware';
import { userRole } from '@prisma/client';

const route = express.Router();
route.post("/",auth(userRole.DOCTOR),doctorScheduleController.insertIntoDb)


export const doctorScheduleRoutes = route