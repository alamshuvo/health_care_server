import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";
import { appointmentService } from "./appointment.service";
import { IAuthUser } from "../../interfaces/common";

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
  

  export const appointmentController ={
    createAppointment
  }