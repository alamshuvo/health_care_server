import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { paymentService } from "./payment.service";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";

const initPayment = catchAsync(async (req: Request & {user?:IAuthUser}, res: Response) => {
  const {appointmentId} = req.params
    const user = req.user;
    const body =req.body;
    const result = await paymentService.initPayment(appointmentId);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "payment initiate sucessfully",
      data: result,
    });
  });

  export const paymentController = {
    initPayment
  }