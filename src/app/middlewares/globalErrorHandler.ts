import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import status from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = status.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.name || err.message || "Something went wrong";
  let error = err;
  if (err instanceof Prisma.PrismaClientValidationError) {
    message = "validation Error";
    error = err.message;
  }
  res.status(statusCode).json({
    success,
    message,
    error,
    stack: err.stack,
  });
  next();
};

export default globalErrorHandler;
