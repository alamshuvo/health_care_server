import {  Request, RequestHandler, Response } from "express";
import { adminService } from "./admin.service";
import { adminFilterAbleFields } from "./admin.const";
import pick from "../../../shared/pick";
import sendResponse from "../../../helpers/sendResponse.helper";
import { status } from "http-status";
import catchAsync from "../../../helpers/catchAsync";

const getAllAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const params = pick(req.query, adminFilterAbleFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await adminService.getAllAdminService(params, options);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Admin data retrived successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.getSingleAdminByID(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin data retrived successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await adminService.updateAdmin(id, data);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin data updated successfully",
    data: result,
  });
});
const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.deleteAdmin(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin data deleted successfully",
    data: result,
  });
});
const softDeleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.deleteSoftAdmin(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Admin data soft deleted successfully",
    data: result,
  });
});
export const adminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
