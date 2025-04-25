import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../../helpers/sendResponse.helper";
import catchAsync from "../../../helpers/catchAsync";
import status from "http-status";
import pick from "../../../shared/pick";
import { userFilterAbleField } from "./user.const";

// const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const data = req.body;
//     console.log(req.body.data);
//     const result = await userService.createAdmin(data);
//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "Admin created successfully",
//       data: result,
//     });
//   } catch (error) {}
// };

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Admin  created successfully",
    data: result,
  });
});


const createDoctor = catchAsync(async (req: Request, res: Response) => {

  const result = await userService.createDoctor(req);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});


const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(
  async (req: Request, res: Response) => {
    const params = pick(req.query, userFilterAbleField);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await userService.getAllFromDb(params, options);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: " all user data retrived successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);
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
    const result = await userService.updateMyProfile(user,req);
    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "My Profile updated successfully",
      data: result,
    });
  });
  const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
      const result = await userService.updateStatus(req.params.id, req.body);
      sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: " user profile updated successfully",
        data: result,
      });
    });

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  changeProfileStatus,
  getAllUsers,
  getMyProfile,
  updateMyProfile
};
