import { NextFunction, Request, Response } from "express"
import status from "http-status"

 const globalErrorHandler=(err:any,req:Request,res:Response,next:NextFunction)=>{
    res.status(status.INTERNAL_SERVER_ERROR).json({
     success:false,
     message:err.name || err.message || "Something went wrong",
     error:err,
     stack:err.stack,
    })
    next()
 }

 export default globalErrorHandler