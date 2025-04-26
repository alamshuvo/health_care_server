import { Prisma } from "@prisma/client";
import { calculatePagination } from "../../../helpers/pagination.helper";
import { IOptions } from "../../interfaces/pagination";
import { doctorSearchableField } from "./doctor.const";
import { prisma } from "../../../shared/prisma";

const getAllFromDb = async (params:any, options: IOptions) => {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andConditions: Prisma.DoctorWhereInput[]= [];
  
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
        OR: doctorSearchableField.map((field) => {
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
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    andConditions.push({
        isDeleted: false,
    });

  
  
    const whereConditions: Prisma.DoctorWhereInput = andConditions.length>0? {
      AND: andConditions,
    }:{}
    const result = await prisma.doctor.findMany({
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
          createdAt:true,
          updatedAt:true, 
          doctorSpecialities:true,
          
        },
        
    });
    const total = await prisma.doctor.count({
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



   const updateIntoDb = async (id:string, data: any) => {
    const isDoctorExist = await prisma.doctor.findUniqueOrThrow({
      where: {
        id,
      },
    })
    const  result = await prisma.doctor.update({
      where:{
        id,
      },
      data:{
        ...data,
      },
    })
    return result
   }
  export const doctorService ={
    getAllFromDb,
    updateIntoDb
  }