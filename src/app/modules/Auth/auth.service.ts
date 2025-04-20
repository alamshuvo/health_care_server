import { prisma } from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import  { JwtPayload, Secret } from "jsonwebtoken";
import generateToken from "../../../helpers/generateToken";
import verifyToken from "../../../helpers/varifyToken";
import { userStatus } from "@prisma/client";
import config from "../../../config";

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
    config.jwt.jwtAccessToken as Secret,
    config.jwt.jwtExpiresIn as string
  );
  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refreshTokenSecret as Secret,
    config.jwt.refreshExpiresIn as string
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
    decodedData = verifyToken(token, config.jwt.refreshTokenSecret as Secret) as JwtPayload;
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
    config.jwt.jwtAccessToken as Secret,
    config.jwt.jwtExpiresIn as string
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
