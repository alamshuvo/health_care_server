import status from "http-status";
import catchAsync from "../../../helpers/catchAsync";
import sendResponse from "../../../helpers/sendResponse.helper";
import pick from "../../../shared/pick";
import { Request, Response } from "express";
import { patientService } from "./patient.service";
import { patientFilterableFields } from "./patient.const";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patientFilterableFields);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await patientService.getAllFromDb(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "patient retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getOnePatientFromDB = catchAsync(async(req:Request,res:Response)=>{
    const id = req.params.id;
    const result = await patientService.getOnePatientFromDB(id);
    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Single Patient Retrived successfully",
        data:result
    })
})

const updatePatient = catchAsync(async(req:Request,res:Response)=>{
    const id = req.params.id;
    const result = await patientService.updatePatient(id,req.body);
    sendResponse(res,{
        statusCode:status.OK,
        success:true,
        message:"Single Patient data updatead  successfully",
        data:result
    })
})
export const patientController = {
  getAllFromDB,
  getOnePatientFromDB,
  updatePatient
};
