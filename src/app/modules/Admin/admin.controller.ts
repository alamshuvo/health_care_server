import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { adminFilterAbleFields } from "./admin.const";
import pick from "../../../shared/pick";

const getAllAdmins = async (req: Request, res: Response) => {
  const params = pick(req.query, adminFilterAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await adminService.getAllAdminService(params, options);
  res.status(200).json({
    success: true,
    message: "Admin all data retrived successfully",
    meta: result.meta,
    data: result.data,
  });
};

const getSingleAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await adminService.getSingleAdminByID(id);
  res.status(200).json({
    success: true,
    message: "Admin data retrived successfully",
    data: result,
  });
};

const updateAdmin = async (req: Request, res: Response) => {
  const {id}= req.params;
  const data = req.body;
  const result = await adminService.updateAdmin(id, data);
  res.status(200).json({
    success: true,
    message: "Admin data updated successfully",
    data: result,
  })
}

const deleteAdmin = async(req:Request,res:Response)=>{
  const {id} = req.params;
  const result = await adminService.deleteAdmin(id);
  res.status(200).json({
    success: true,
    message: "Admin data deleted successfully",
    data: result,
  })
}

export const adminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin
};
