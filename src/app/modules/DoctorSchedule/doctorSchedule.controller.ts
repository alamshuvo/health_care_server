import status from "http-status";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import { Request, Response } from "express";
import { doctorScheduleService } from "./doctorSchedule.service";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const body =req.body;
  const result = await doctorScheduleService.insertIntoDb(user,body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor schedul  create successfully",
    data: result,
  });
});

export const doctorScheduleController = {
  insertIntoDb,
};
