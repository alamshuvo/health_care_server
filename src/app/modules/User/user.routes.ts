import express from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/authMiddleware";
import { userRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";


const router = express.Router();



router.post("/", auth(userRole.ADMIN,userRole.SUPER_ADMIN),fileUploader.upload.single('file'), userController.createAdmin);

export const userRoutes = router;
