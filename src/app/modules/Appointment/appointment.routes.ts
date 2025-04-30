import express, { Router }  from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middlewares/authMiddleware";
import { userRole } from "@prisma/client";
const route =express.Router()

route.post("/",auth(userRole.PATIENT),appointmentController.createAppointment);
route.get("/",auth(userRole.PATIENT,userRole.DOCTOR),appointmentController.getAppointment)

export const appointmentRoutes = route