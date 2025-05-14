import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";
import { appointmentService } from "./appointment.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { appointmentFilterableFields } from "./appointment.const";

const createAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const data = req.body;
    const result = await appointmentService.createAppointment(
      data,
      user as IAuthUser
    );
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Appointment created successfully",
      data: result,
    });
  }
);

const getAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
  
    const filters = pick(req.query, ["status", "paymentStatus"]);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await appointmentService.getAppointment(
      user as IAuthUser,
      filters,
      options
    );
    
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Appointment retrived successfully",
      data: result,
    });
  }
);
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, appointmentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await appointmentService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Appointment retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});
const changeAppointmentStatus = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const {id}= req.params
    const user = req.user;
    const status = req.body.status
    const result = await appointmentService.changeAppointmentStatus(id,status,user as IAuthUser);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Appointment status Changed successfully",
      data: result,
    });
  }
);

export const appointmentController = {
  createAppointment,
  getAppointment,
  changeAppointmentStatus,
  getAllFromDB,
};
