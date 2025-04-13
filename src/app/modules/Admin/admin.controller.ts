import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import { adminFilterAbleFields } from "./admin.const";
import pick from "../../../shared/pick";
import sendResponse from "../../../helpers/sendResponse.helper";
import { status } from "http-status";

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const getSingleAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminService.getSingleAdminByID(id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Admin data retrived successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await adminService.updateAdmin(id, data);

    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Admin data updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteAdmin(id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Admin data deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteSoftAdmin(id);
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "Admin data soft deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const adminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
