import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/authMiddleware";
import { userRole } from "@prisma/client";
const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/refreshToken", authController.refreshToken);
router.post(
  "/change-password",
  auth(userRole.ADMIN, userRole.DOCTOR, userRole.PATIENT, userRole.SUPER_ADMIN),
  authController.changePassword
);
router.post("/forgot-password", authController.forgotPassword);
router.post(
  "/reset-password/",
  authController.resetPassword
);

export const authRoutes = router;
