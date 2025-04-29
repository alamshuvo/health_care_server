import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import { scheduleService } from "./schedule.service";
import status from "http-status";
import pick from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
    // const filters = pick(req.query, patientFilterableFields);
  
    // const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  
    const result = await scheduleService.insertIntoDb(req.body);
  
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "schedul data create successfully",
      data:result
    });
  });


  const getAllFromDB = catchAsync(async (req: Request & {user?:IAuthUser}, res: Response) => {
    const user = req.user
    const filters = pick(req.query, ["startDateTime","endDateTime"]);
  
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  
    const result = await scheduleService.getAllFormDB(filters,options,user as IAuthUser);
  
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "schedul data retrived  successfully",
      data:result
    });
  });

  export const scheduleController = {
    insertIntoDb,
    getAllFromDB
  }
  