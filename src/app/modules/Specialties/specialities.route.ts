import express, { NextFunction, Request, Response } from "express";
import { specialtiesController } from "./specialties.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { SpecialityValidation } from "./specialities.validation";
const router = express.Router();

router.post(
  "/create-speciality",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialityValidation.createSpecialities.parse(JSON.parse(req.body.data));
    return specialtiesController.createSpecialities(req, res, next);
  }
);

router.get("/specialties", specialtiesController.getSpecialities);
router.delete("/:id", specialtiesController.deleteSpecilitiesById);

export const specialtyRoutes = router;
