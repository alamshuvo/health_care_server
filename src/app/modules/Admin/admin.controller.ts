import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { adminFilterAbleFields} from "./admin.const";
import pick from "../../../shared/pick";



const getAllAdmins = async (req: Request, res: Response) => {

  const params =   pick(req.query, adminFilterAbleFields);
  const options = pick(req.query,['page','limit','sortBy','sortOrder']);
   
  const result = await adminService.getAllAdminService(params,options);
  res.status(200).json({
    success: true,
    message: "Admin all data retrived successfully",
    data: result,
  });
};

export const adminController = {
  getAllAdmins,
};
