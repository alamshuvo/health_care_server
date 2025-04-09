import { Request, Response } from "express";
import { adminService } from "./admin.service";
import { adminSearchAbleFields } from "./admin.const";

const pick = <T extends Record<string,unknown>,K extends keyof T>(obj:T, keys:K[]):Partial<T> => {
  const finalObj:Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj
};

const getAllAdmins = async (req: Request, res: Response) => {

  const params =   pick(req.query, adminSearchAbleFields);
  const result = await adminService.getAllAdminService(params);
  res.status(200).json({
    success: true,
    message: "Admin all data retrived successfully",
    data: result,
  });
};

export const adminController = {
  getAllAdmins,
};
