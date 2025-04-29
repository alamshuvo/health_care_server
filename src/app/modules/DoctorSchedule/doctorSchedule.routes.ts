import express from 'express';
import { doctorScheduleController } from './doctorSchedule.controller';
import auth from '../../middlewares/authMiddleware';
import { userRole } from '@prisma/client';

const route = express.Router();
route.post("/",auth(userRole.DOCTOR),doctorScheduleController.insertIntoDb)
route.get("/my-schedule",auth(userRole.DOCTOR),doctorScheduleController.getMySchedule);
route.delete("/:id",auth(userRole.DOCTOR),doctorScheduleController.deleteFormDB)

export const doctorScheduleRoutes = route