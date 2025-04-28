import { Prisma } from "@prisma/client";
import { calculatePagination } from "../../../helpers/pagination.helper";
import { IOptions } from "../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { patientSearchableField } from "./patient.const";

const getAllFromDb = async (params:any, options: IOptions) => {
    const { limit, page, skip } = calculatePagination(options);
    const { searchTerm, specialties,...filterData } = params;
    const andConditions: Prisma.PatientWhereInput[]= [];
  
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
        OR: patientSearchableField.map((field) => {
          return {
            [field]: {
              contains: params.searchTerm,
              mode: "insensitive",
            },
          };
        }),
      });
    }
//    if (specialties && specialties.length>0) {
//     andConditions.push({
//       doctorSpecialities:{
//        some:{
//         speciality:{
//           title:{
//             contains: specialties,
//             mode: "insensitive",
//           }
//         }
//        } 
//       }
//     })
//    }
    if (Object.keys(filterData).length > 0) {
      const filterConditions = Object.keys(filterData).map(key => ({
          [key]: {
              equals: (filterData as any)[key],
          },
      }));
      andConditions.push(...filterConditions);
  }
  
    const whereConditions: Prisma.PatientWhereInput = andConditions.length>0? {
      AND: andConditions,
    }:{}
    const result = await prisma.patient.findMany({
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
          patientHealthData:true,
          medicalReport:true,
          user:true
        },
        
    });
    const total = await prisma.patient.count({
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



  export const patientService = {
    getAllFromDb,
  }