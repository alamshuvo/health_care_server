import express, { Router }  from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middlewares/authMiddleware";
import { userRole } from "@prisma/client";
const route =express.Router()

route.post("/",auth(userRole.PATIENT),appointmentController.createAppointment)

export const appointmentRoutes = route