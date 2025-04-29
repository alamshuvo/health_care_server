import express from "express";
import { scheduleController } from "./schedule.controller";
import auth from "../../middlewares/authMiddleware";
import { userRole } from "@prisma/client";
const route = express.Router();

route.post(
  "/",
  auth(userRole.SUPER_ADMIN, userRole.ADMIN),
  scheduleController.insertIntoDb
);
route.get("/", scheduleController.getAllFromDB);

export const scheduleRoutes = route;
