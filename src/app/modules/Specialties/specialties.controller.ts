import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";
import { specialitiesService } from "./specialities.service";

const createSpecialities = catchAsync(async (req: Request, res: Response) => {
   
    const result = await specialitiesService.createSpecialities(req);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Speciality  created successfully",
      data: result,
    });
  });
  

  export const specialtiesController = {
    createSpecialities
  }