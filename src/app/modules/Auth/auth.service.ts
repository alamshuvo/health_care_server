import { prisma } from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const loginUser = async (payload: { email: string; password: string }) => {
  //check is user data exist
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  // check is password correct
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );
  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };
  const accessToken = jwt.sign(jwtPayload, "abcdefg", {
    expiresIn: "15m",
    algorithm: "HS256",
  });
  console.log(accessToken);
  return userData;
};
export const authService = {
  loginUser,
};
