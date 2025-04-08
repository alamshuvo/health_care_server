
import { Request, Response } from "express";
import { adminService } from "./admin.service";


const getAllAdmins = async(req:Request,res:Response)=>{
    const params = req.query;
const result = await adminService.getAllAdminService(params);
res.status(200).json({
    success:true,
    message:"Admin all data retrived successfully",
    data:result
})
}

export const adminController ={
    getAllAdmins
}