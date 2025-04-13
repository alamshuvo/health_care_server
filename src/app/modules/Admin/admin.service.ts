import { Admin, Prisma, PrismaClient, userStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.const";
import { calculatePagination } from "../../../helpers/pagination.helper";
import { prisma } from "../../../shared/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { IOptions } from "../../interfaces/pagination";

const getAllAdminService = async (params: IAdminFilterRequest, options: IOptions) => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];

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
      OR: adminSearchAbleFields.map((field) => {
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

  andConditions.push({
    isDeleted: false,
  })

  const whereConditions: Prisma.AdminWhereInput = {
    AND: andConditions,
  };
  const result = await prisma.admin.findMany({
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
  });
  const total = await prisma.admin.count({
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

const getSingleAdminByID = async (id: string):Promise<Admin| null> => {
  const result = await prisma.admin.findUnique({
    where:{
      id,
      isDeleted:false
    }
  
  })
  if (!result) {
    throw new Error("Admin not found");
    
  }
  return result;
}

const updateAdmin = async (id: string, data: Partial<Admin>):Promise<Admin> => {
 await prisma.admin.findUniqueOrThrow({
  where:{id}
 })
 const result = await prisma.admin.update({
  where:{id,isDeleted:false},
  data
 })
  return result;
}

const deleteAdmin = async (id: string):Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where:{id}
  })
 const result = await prisma.$transaction(async(tx)=>{
  const adminDeletedData = await tx.admin.delete({
    where:{id}
  })
  const userDeletedData = await tx.user.delete({
    where:{
      email:adminDeletedData.email
    }
    
  })
  return adminDeletedData
 })
 return result;
}


const deleteSoftAdmin = async (id: string):Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({
    where:{id,isDeleted:false}
  })
 const result = await prisma.$transaction(async(tx)=>{
  const adminDeletedData = await tx.admin.update({
    where:{id},
    data:{
      isDeleted:true
    }
  })
  const userDeletedData = await tx.user.update({
    where:{
      email:adminDeletedData.email
    },
    data:{
      status:userStatus.DELETED
    }
    
  })
  return adminDeletedData
 })
 return result;
}

export const adminService = {
  getAllAdminService,
  getSingleAdminByID,
  updateAdmin,
  deleteAdmin,
  deleteSoftAdmin
};

/**
 * data = 1 2 3 4 5 6 7 8
 * page = 2
 * limit = 3
 * skip = 3
 * formula = page-1*limit
 * * */
