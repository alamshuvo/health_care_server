import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const data = req.body;
  const result = await authService.loginUser(data);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "log in sucessfully",
    data: result,
  });
});

export const authController = {
  loginUser,
};
