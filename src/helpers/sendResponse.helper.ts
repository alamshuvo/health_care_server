import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number;
    success: boolean;
    message: string;
    meta?: { page: number; limit: number; total: number };
    data: T | null | undefined | T[];
  }
) => {
  const { statusCode, success, message, meta, data } = jsonData;

  res.status(statusCode).json({
    statusCode,
    success,
    message,
    meta: meta || null || undefined,
    data: data || null || undefined,
  });
};

export default sendResponse;
