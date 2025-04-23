import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../../helpers/sendResponse.helper";
import catchAsync from "../../../helpers/catchAsync";
import status from "http-status";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const result = await userService.createAdmin(data);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {}
};

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctor(req);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});


const getMyProfile = catchAsync(async (req: Request, res: Response) => {
const user = req.user;
  const result = await userService.getMyProfile(user);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "My Profile data fetched successfully",
    data: result,
  });
});


const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
    const result = await userService.updateMyProfile(user,req.body);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "My Profile updated successfully",
      data: result,
    });
  });

export const userController = {
  createAdmin,
  createDoctor,
  getMyProfile,
  updateMyProfile
};
