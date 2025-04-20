import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await authService.loginUser(data);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "log in sucessfully",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needsPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await authService.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user
  const newPassword = req.body;
  const result = await authService.changePassword(user,newPassword);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "changed password successfully",
    data: result,
  });
});
export const authController = {
  loginUser,
  refreshToken,
  changePassword
};
