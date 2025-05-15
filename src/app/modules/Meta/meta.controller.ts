import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";
import { MetaDataService } from "./meta.service";

const fetchDashboardMetaData = catchAsync(async (req: Request & {user?:IAuthUser}, res: Response) => {
    const user = req.user;
    const body =req.body;
    const result = await MetaDataService.fetchDashboardMetaData(user as IAuthUser,);
    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "meta Data Fetch successfully",
      data: result,
    });
  });


  export const MetaController = {
    fetchDashboardMetaData
  }
  
