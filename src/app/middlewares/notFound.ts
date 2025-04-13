import { NextFunction, Request, Response } from "express";
import status from "http-status"

const notFound=(req:Request,res:Response,next:NextFunction)=>{
    res.status(status.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        error: {
            orginalUrl: req.originalUrl,
            method: req.method,
            message: "your requested path is not found ",
        }
    });
}

export default notFound;