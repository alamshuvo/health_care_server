import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.const";

const prisma = new PrismaClient();
const getAllAdminService = async (params: any) => {
  const {searchTerm,...filterData}= params;
  const andConditions:Prisma.AdminWhereInput[] = [];
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
      OR:adminSearchAbleFields.map((field)=>{
        return{
          [field]:{
            contains:params.searchTerm,
            mode:'insensitive',
          }
        }
      })
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
       
        },
      })),
    });
  }
  
  const whereConditions:Prisma.AdminWhereInput = {
    AND: andConditions,
  };
  const result = await prisma.admin.findMany({
    where: whereConditions,
  });
  return result;
};
export const adminService = {
  getAllAdminService,
};
