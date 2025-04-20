import express from "express";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AdminValidationSchema } from "../../validation/adminvalidation";
import auth from "../../middlewares/authMiddleware";
import { userRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  adminController.getAllAdmins
);
router.get(
  "/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  adminController.getSingleAdmin
);
router.patch(
  "/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  validateRequest(AdminValidationSchema.adminValidation),
  adminController.updateAdmin
);
router.delete(
  "/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  adminController.deleteAdmin
);
router.delete(
  "/soft/:id",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  adminController.softDeleteAdmin
);
export const adminRoutes = router;
