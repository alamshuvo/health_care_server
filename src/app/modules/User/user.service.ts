import { PrismaClient, userRole } from "@prisma/client";
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
export const userService = {
  createAdmin,
  createDoctor,
};
