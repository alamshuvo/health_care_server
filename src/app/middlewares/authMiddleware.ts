import { NextFunction, Request, Response } from "express";
import verifyToken from "../../helpers/varifyToken";
import config from "../../config";

const auth = (...role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("you are not authorized");
      }
      const varifiedUser = verifyToken(
        token as string,
        config.jwt.jwtAccessToken as string
      );
      if (role.length && !role.includes(varifiedUser.role)) {
        throw new Error("you are not authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
