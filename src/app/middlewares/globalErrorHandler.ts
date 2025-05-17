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
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code == "P2002") {
      message = "Duplicate key Error";
      error = err.meta;
    }
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
