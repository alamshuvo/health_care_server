import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";
import { reviewService } from "./review.service";

const insertIntoDb = catchAsync(async (req: Request &{user?:IAuthUser}, res: Response) => {
    const user = req.user
    const data = req.body
     const result = await reviewService.insertIntoDb(user as IAuthUser,data);
   
     sendResponse(res, {
       statusCode: status.CREATED,
       success: true,
       message: "Prescription data create successfully",
       data: result,
     });
   });


export const ReviewController ={
    insertIntoDb
}
