import { Prisma } from "@prisma/client";
import { calculatePagination } from "../../../helpers/pagination.helper";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IOptions } from "../../interfaces/pagination";
import ApiError from "../../errors/apiError";
import status from "http-status";

const insertIntoDb = async (user: any, payload: { scheduleIds: string[] }) => {
  const { scheduleIds } = payload;
  const { email } = user;
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email,
    },
  });
  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
  }));
  const result = await prisma.doctorSchedule.createMany({
    data: doctorScheduleData,
  });
  return result;
};
const getAllFormDB = async (
  params: any,
  options: IOptions,
  user: IAuthUser
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { startDateTime, endDateTime, isBooked, ...filterData } = params;
  console.log(isBooked);
  const andConditions: Prisma.doctorScheduleWhereInput[] = [];
  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDateTime,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDateTime,
            },
          },
        },
      ],
    });
  }
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
  
    if (typeof filterData.isBooked === "string" && isBooked === "true") {
   
      filterData.isBooked = true;
    }
    if (typeof filterData.isBooked === "string" && isBooked === "false") {
      filterData.isBooked = false;
    }
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.doctorScheduleWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.doctorSchedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
  });
  const total = await prisma.doctorSchedule.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};


const deleteFormDB = async(id:string,user:IAuthUser)=>{
 const doctorData = await prisma.doctor.findFirstOrThrow({
  where:{
    email:user?.email
  }
 })

 const isBookedSchedule = await prisma.doctorSchedule.findUnique({
  where:{
    doctorId_scheduleId:{
      doctorId:doctorData.id,
      scheduleId:id
    }
  }
 });
 if (isBookedSchedule?.isBooked) {
  throw new ApiError(status.BAD_REQUEST,"you can not delete the schedule because of this schedule is booked");
 }
 const result  = await prisma.doctorSchedule.delete({
  where:{
    doctorId_scheduleId:{
      doctorId:doctorData.id,
      scheduleId:id
    }
  }
 })
 return result
}
export const doctorScheduleService = {
  insertIntoDb,
  getAllFormDB,
  deleteFormDB
};
