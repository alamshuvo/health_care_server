import express from "express";
import auth from "../../middlewares/authMiddleware";
import { userRole } from "@prisma/client";
import { ReviewController } from "./review.controller";
const router = express.Router()
router.post("/",auth(userRole.PATIENT),ReviewController.insertIntoDb)
export const ReviewRoutes = router