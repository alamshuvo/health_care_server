import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/authMiddleware";
import { userRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get(
  "/",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  userController.getAllUsers
);
//get my profile 

router.get("/me",auth(userRole.SUPER_ADMIN,userRole.ADMIN,userRole.DOCTOR,userRole.PATIENT),userController.getMyProfile)
router.post(
  "/create-admin",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return userController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return userController.createDoctor(req, res, next);
  }
);

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatient.parse(JSON.parse(req.body.data));
    return userController.createPatient(req, res, next);
  }
);


router.patch("/:id/status",auth(userRole.SUPER_ADMIN,userRole.ADMIN),validateRequest(userValidation.updateStatus),userController.changeProfileStatus)


router.patch(
  "/update-my-profile",
  auth(userRole.ADMIN, userRole.SUPER_ADMIN,userRole.DOCTOR,userRole.PATIENT),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data)
    return userController.updateMyProfile(req, res, next);
  }
);



export const userRoutes = router;
