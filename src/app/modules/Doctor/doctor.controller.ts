import { Request, Response } from "express";
import catchAsync from "../../../helpers/catchAsync";
import pick from "../../../shared/pick";
import { doctorFilterableFields } from "./doctor.const";
import sendResponse from "../../../helpers/sendResponse.helper";
import status from "http-status";
import { doctorService } from "./doctor.service";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, doctorFilterableFields);

    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await doctorService.getAllFromDb(filters, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Doctors retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const doctorController = {
    getAllFromDB
}