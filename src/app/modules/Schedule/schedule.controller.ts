import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import { scheduleService } from "./schedule.service";
import status from "http-status";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
    // const filters = pick(req.query, patientFilterableFields);
  
    // const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  
    const result = await scheduleService.insertIntoDb(req.body);
  
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "patient retrieval successfully",
      data:result
    });
  });

  export const scheduleController = {
    insertIntoDb
  }
  