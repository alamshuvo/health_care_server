import { prisma } from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import { JwtPayload, Secret } from "jsonwebtoken";
import generateToken from "../../../helpers/generateToken";
import verifyToken from "../../../helpers/varifyToken";
import { userStatus } from "@prisma/client";
import config from "../../../config";
import emailSender from "../../../helpers/sendMail";
import ApiError from "../../errors/apiError";
import status from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  //check is user data exist
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: userStatus.ACTIVE,
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
    decodedData = verifyToken(
      token,
      config.jwt.refreshTokenSecret as Secret
    ) as JwtPayload;
  } catch (error) {
    throw new Error("you are not authorized");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email,
      status: userStatus.ACTIVE,
    },
  });
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

const changePassword = async (
  user: { email: string },
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: userStatus.ACTIVE,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("password incorect");
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt.bacryptSaltRound)
  );
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "password changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: userStatus.ACTIVE,
    },
  });
  const resetPasswordToken = generateToken(
    { email: userExist.email, role: userExist.role },
    config.resetPasswordCredential.resetPasswordSecret as Secret,
    config.resetPasswordCredential.resetTokenExpireIn as string
  );
  const resetLink =
    config.resetPasswordCredential.resetPasswordLink +
    `?email=${userExist.email}&token=${resetPasswordToken}`;

  await emailSender(
    userExist.email,

    `
      <div>
        <h1>Reset Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">
        <button style={{backgro}}>
        Reset Password
        </button>
        </a>
      </div>
      `
  );
};

const resetPassword = async (
  payload: {
    email: string;
    newPassword: string;
  },
  token: string
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: userStatus.ACTIVE,
    },
  });
  const isValidToken = verifyToken(
    token,
    config.resetPasswordCredential.resetPasswordSecret as Secret
  ) as JwtPayload;
  if (!isValidToken) {
    throw new ApiError(status.FORBIDDEN, "forbidden");
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt.bacryptSaltRound)
  )
  await prisma.user.update({
    where:{
      email:payload.email
    },
    data:{
      password:hashedPassword,
      needPasswordChange:false
    }
  })
};

export const authService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
