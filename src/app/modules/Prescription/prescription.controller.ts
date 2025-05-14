import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";
import { prescriptionService } from "./prescription.service";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDb = catchAsync(async (req: Request &{user?:IAuthUser}, res: Response) => {
 const user = req.user
 const data = req.body
  const result = await prescriptionService.insertIntoDb(user as IAuthUser,data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "schedul data create successfully",
    data: result,
  });
});

export const prescriptionController = {
  insertIntoDb,
};
