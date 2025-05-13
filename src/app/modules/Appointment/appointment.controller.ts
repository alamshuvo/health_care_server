import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";
import { appointmentService } from "./appointment.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const createAppointment = catchAsync(async (req: Request &{user?:IAuthUser}, res: Response) => {
    const user =req.user
     const data = req.body;
    const result = await appointmentService.createAppointment(data,user as IAuthUser);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Appointment created successfully",
      data: result,
    });
  });

  const getAppointment = catchAsync(async (req: Request &{user?:IAuthUser}, res: Response) => {
    const user =req.user
    const filters = pick(req.query,["status","paymentStatus"])
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await appointmentService.getAppointment(user as IAuthUser,filters,options);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Appointment retrived successfully",
      data: result,
    });
  });

  const changeAppointmentStatus = catchAsync(async (req: Request &{user?:IAuthUser}, res: Response) => {
    const user =req.user
    const result = await appointmentService.changeAppointmentStatus();
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Appointment status Changed successfully",
      data: result,
    });
  });
  

  export const appointmentController ={
    createAppointment,
    getAppointment,
    changeAppointmentStatus
  }