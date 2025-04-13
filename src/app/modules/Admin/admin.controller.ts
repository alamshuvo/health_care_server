import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { adminFilterAbleFields } from "./admin.const";
import pick from "../../../shared/pick";
import sendResponse from "../../../helpers/sendResponse.helper";

const getAllAdmins = async (req: Request, res: Response) => {
  const params = pick(req.query, adminFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await adminService.getAllAdminService(params, options);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin data retrived successfully",
    meta: result.meta,
    data: result.data,
  });
};

const getSingleAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.getSingleAdminByID(id);
  sendResponse(res,{
    success: true,
    statusCode: 200,
    message: "Admin data retrived successfully",
    data: result,
  })
};

const updateAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await adminService.updateAdmin(id, data);

  sendResponse(res,{
    success: true,
    statusCode: 200,
    message: "Admin data updated successfully",
    data: result,
  })
};

const deleteAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.deleteAdmin(id);
 sendResponse(res,{
    success: true,
    statusCode: 200,
    message: "Admin data deleted successfully",
    data: result,
 })
};

const softDeleteAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.deleteSoftAdmin(id);
  sendResponse(res,{
    success: true,
    statusCode: 200,
    message: "Admin data soft deleted successfully",
    data: result,
  })
};
export const adminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
