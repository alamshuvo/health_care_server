import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";
import { prescriptionService } from "./prescription.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const insertIntoDb = catchAsync(async (req: Request &{user?:IAuthUser}, res: Response) => {
 const user = req.user
 const data = req.body
  const result = await prescriptionService.insertIntoDb(user as IAuthUser,data);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Prescription data create successfully",
    data: result,
  });
});
 const patientPrescription = catchAsync(async (req: Request &{user?:IAuthUser}, res: Response) => {
    const user = req.user
    const options = pick(req.query,["limit","page","sortBy","sortOrder"])
    const data = req.body
     const result = await prescriptionService.patientPrascription(user as IAuthUser,options);
   
     sendResponse(res, {
       statusCode: status.OK,
       success: true,
       message: "your prescription data retrive successfully",
       meta:result.meta,
       data: result.data,
     });
   });
export const prescriptionController = {
  insertIntoDb,
  patientPrescription

};
