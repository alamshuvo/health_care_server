import { prisma } from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import generateToken from "../../../helpers/generateToken";
import verifyToken from "../../../helpers/varifyToken";
import { userStatus } from "@prisma/client";

const loginUser = async (payload: { email: string; password: string }) => {
  //check is user data exist
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status:userStatus.ACTIVE
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

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = verifyToken(token, "abcdefgadfdfsf") as JwtPayload;
  } catch (error) {
    throw new Error("you are not authorized");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where:{
        email:decodedData?.email,
        status:userStatus.ACTIVE
    }
  })
  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "abcdefg",
    "5m"
  );
  return {
    accessToken,
    needsPasswordChange: userData.needPasswordChange,
    refreshToken,
  }; 
};
export const authService = {
  loginUser,
  refreshToken,
};
