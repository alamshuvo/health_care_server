import { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../../helpers/sendResponse.helper";

const createAdmin = async (req: Request, res: Response) => {
 try {
  const data = req.body;
  console.log(data);
  const result = await userService.createAdmin(data);
 sendResponse(res,{
  statusCode:200,
  success:true,
  message:"Admin created successfully",
  data:result
 })
 } catch (error) {
  
 }
};



export const userController = {
  createAdmin,

};
