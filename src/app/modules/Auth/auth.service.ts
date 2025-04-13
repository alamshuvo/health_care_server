import { prisma } from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateToken from "../../../helpers/generateToken";

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
  if (!isCorrectPassword) {
    throw new Error("password incorect");
  }
  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };
  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefg",
    "5m"
  );
  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefgadfdfsf",
    "30d"
  );
  return {
    accessToken,
    needsPasswordChange: userData.needPasswordChange,
    refreshToken,
  };
};

const refreshToken =async(token:string)=>{
 console.log(token);
}
export const authService = {
  loginUser,
  refreshToken
};
