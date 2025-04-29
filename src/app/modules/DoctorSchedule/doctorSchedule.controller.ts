import status from "http-status";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import { Request, Response } from "express";
import { doctorScheduleService } from "./doctorSchedule.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const insertIntoDb = catchAsync(async (req: Request & {user?:IAuthUser}, res: Response) => {
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


const getMySchedule = catchAsync(async (req: Request & {user?: IAuthUser}, res: Response) => {
  const user =req.user
  const filters = pick(req.query, ["startDate","endDate","isBooked"]);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await doctorScheduleService.getAllFormDB(filters, options,user as IAuthUser);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "My Schedule retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});
const deleteFormDB = catchAsync(async (req: Request & {user?:IAuthUser}, res: Response) => {
  const id = req.params.id;
  const user = req.user
  const result = await doctorScheduleService.deleteFormDB(id,user as IAuthUser);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor schedul  deleted successfully",
    data: result,
  });
});

export const doctorScheduleController = {
  insertIntoDb,
  getMySchedule,
  deleteFormDB
};
