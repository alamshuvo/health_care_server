import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { prisma } from "../../../shared/prisma";

const createSpecialities = async (req: Request) => {
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.body.icon = uploadToCloudinary?.secure_url;
  }
  const result = await prisma.specialties.create({
    data: req.body.body,
  });

  return result;
};
// set up different 
const getSpecialities = async () => {
  const result = await prisma.specialties.findMany({});
  return result;
};

const deleteSpecialitiesById = async (id: string) => {
  const SpecialitiesExist = await prisma.specialties.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const result = await prisma.specialties.delete({
    where: {
      id,
    },
  });
  return result;
};

export const specialitiesService = {
  createSpecialities,
  getSpecialities,
  deleteSpecialitiesById,
};
