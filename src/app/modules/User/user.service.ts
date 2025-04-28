import { Admin, Doctor, Patient, Prisma, PrismaClient, userRole, userStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { Request } from "express";
import { IAuthUser } from "../../interfaces/common";
import { IFile } from "../../interfaces/file";
import { IOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/pagination.helper";
import { userSearchableField } from "./user.const";


const createAdmin = async (req:Request):Promise<Admin> => {

const file = req.file as IFile;
if (file) {
  const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
  console.log(uploadToCloudinary,"uploaded");
  req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  console.log(req.body,"upload to cloudinary tekhe asar por");
}

  const hashedPassword: string = await bcrypt.hash(req.body.password, 15);
  const userPayload = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: userRole.ADMIN,
  };
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userPayload,
    });
    const creataedAdminData = await tx.admin.create({
      data: req.body.admin,
    });
    return creataedAdminData;
  });

  return result;
};

const createDoctor = async (req: Request):Promise<Doctor> => {
  const file = req.file as IFile;
  if (file) {
 
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
    console.log("ekhane");
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

const createPatient = async (req: Request):Promise<Patient> => {
  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 15);
  const userPayload = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: userRole.PATIENT,
  };
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: userPayload,
    });
    const createDoctorData = await tx.patient.create({
      data: req.body.patient,
    });
    return createDoctorData;
  });
  return result;
};
const getAllFromDb = async (params:any, options: IOptions) => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.UserWhereInput[]= [];

  // some code added
  // [
  //   {
  //     name: {
  //       contains: params.searchTerm,
  //       mode: "insensitive",
  //     },
  //   },
  //   {
  //     email: {
  //       contains: params.searchTerm,
  //       mode: "insensitive",
  //     },
  //   },
  //   {
  //     contactNumber: {
  //       contains: params.searchTerm,
  //       mode: "insensitive",
  //     },
  //   },
  // ],

  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchableField.map((field) => {
        return {
          [field]: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }


  const whereConditions: Prisma.UserWhereInput = andConditions.length>0? {
    AND: andConditions,
  }:{}
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
      select:{
        id:true,
        email:true,
        role:true,
        needPasswordChange:true,
        status:true,
        createdAt:true,
        updatedAt:true, 
        admin:true,
        doctor:true,
        
      },
      
  });
  const total = await prisma.user.count({
    where:whereConditions
  });
  return {
    meta: {
      page,
      limit,
      total,

    },
    data:result,
  };
};





const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
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

const updateMyProfile = async (user:IAuthUser, req:Request) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: userStatus.ACTIVE,
    },
  });
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }
  let profileInfo;
  if (isUserExist.role === userRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: isUserExist.email,
      },
      data: req.body
    });
  } else if (isUserExist.role === userRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: isUserExist.email,
      },
      data: req.body
    });
  } else if (isUserExist.role === userRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: isUserExist.email,
      },
      data: req.body
    });
  } else if (isUserExist.role === userRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: isUserExist.email,
      },
      data: req.body
    });
  }
  return { ...profileInfo };
};


const updateStatus = async(id:string,payload:{status:userStatus})=>{
  const userExist = await prisma.user.findUniqueOrThrow({
    where:{
      id
    }
  })
  const updateUser = await prisma.user.update({
    where:{
      id
    },
    data:{
      status:payload.status
    }
  })
  return updateUser
}
export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDb,
  getMyProfile,
  updateMyProfile,
  updateStatus
};
