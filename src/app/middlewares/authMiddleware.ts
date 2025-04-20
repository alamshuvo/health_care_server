import { NextFunction, Request, Response } from "express";
import verifyToken from "../../helpers/varifyToken";
import config from "../../config";
import ApiError from "../errors/apiError";
import status from "http-status";

const auth = (...role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(status.UNAUTHORIZED, "you are not authorized");
      }
      const varifiedUser = verifyToken(
        token as string,
        config.jwt.jwtAccessToken as string
      );
    
      req.user = varifiedUser;
      if (role.length && !role.includes(varifiedUser.role)) {
        throw new ApiError(status.FORBIDDEN, "you are not authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
