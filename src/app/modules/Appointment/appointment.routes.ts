import express, { Router }  from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middlewares/authMiddleware";
import { userRole } from "@prisma/client";
const route =express.Router()
route.get("/my-appointment",auth(userRole.PATIENT,userRole.DOCTOR),appointmentController.getAppointment)
route.get("/",auth(userRole.SUPER_ADMIN,userRole.ADMIN),appointmentController.getAllFromDB)
route.post("/",auth(userRole.PATIENT),appointmentController.createAppointment);

route.patch("/status/:id",auth(userRole.SUPER_ADMIN,userRole.ADMIN,userRole.DOCTOR),appointmentController.changeAppointmentStatus)

export const appointmentRoutes = route