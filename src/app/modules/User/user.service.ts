import { PrismaClient, userRole, userStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";

const createAdmin = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 15);
  const userPayload = {
    email: data.admin.email,
    password: hashedPassword,
    role: userRole.ADMIN,
  };
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userPayload,
    });
    const creataedAdminData = await tx.admin.create({
      data: data.admin,
    });
    return creataedAdminData;
  });
  return result;
};

const createDoctor = async (req: any) => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 15);
  const userPayload = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: userRole.DOCTOR,
  };
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userPayload,
    });
    const createDoctorData = await tx.doctor.create({
      data: req.body.doctor,
    });
    return createDoctorData;
  });
  return result;
};

const getMyProfile = async (user: any) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: userStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
    },
  });
  let profileInfo;
  if (userInfo.role === userRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === userRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === userRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  // else if(userInfo.role === userRole.PATIENT){
  //   profileInfo = await prisma.doctor.findUnique({
  //     where: {
  //       email: userInfo.email,
  //     },
  //   });

  // }
  return { ...userInfo, ...profileInfo };
};

const updateMyProfile = async (user: any, payload: any) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: userStatus.ACTIVE,
    },
  });
  let profileInfo;
  if (isUserExist.role === userRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: isUserExist.email,
      },
      data: {
        ...payload,
      },
    });
  } else if (isUserExist.role === userRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: isUserExist.email,
      },
      data: {
        ...payload,
      },
    });
  } else if (isUserExist.role === userRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: isUserExist.email,
      },
      data: {
        ...payload,
      },
    });
  } else if (isUserExist.role === userRole.PATIENT) {
    profileInfo = await prisma.admin.update({
      where: {
        email: isUserExist.email,
      },
      data: {
        ...payload,
      },
    });
  }
  return { ...profileInfo };
};
export const userService = {
  createAdmin,
  createDoctor,
  getMyProfile,
  updateMyProfile,
};
