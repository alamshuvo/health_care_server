import { addHours, addMinutes, format } from "date-fns";
import { prisma } from "../../../shared/prisma";
import { Prisma, Schedule } from "@prisma/client";
import { IFilterRequest, ISchedule } from "./schedule.interface";
import { IOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/pagination.helper";
import { IAuthUser } from "../../interfaces/common";
const convertedTime = async(date:Date)=>{ 
const offset = date.getTimezoneOffset() * 60000;
return new Date(date.getTime()+offset)
}
const insertIntoDb = async (payload: ISchedule):Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;
  const curentDate = new Date(startDate); // start Date
  const LastDate = new Date(endDate); // end Date

  const interValTime = 30;
  const schedule = [];
  while (curentDate <= LastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(curentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(curentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );
    while (startDateTime < endDateTime) {
      // const scheduleData = {
      //   startDateTime: startDateTime,
      //   endDateTime: addMinutes(startDateTime, interValTime),
      // };
      const startDateTimes = await convertedTime(startDateTime)
      const endDateTimes = await convertedTime(addMinutes(startDateTime, interValTime))
      const scheduleData = {
        startDateTime: startDateTimes,
        endDateTime: endDateTimes,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where:{
            startDateTime:scheduleData.startDateTime,
            endDateTime:scheduleData.endDateTime
        }
      })
     if (!existingSchedule) {
        const result = await prisma.schedule.create({
            data: scheduleData,
          });
    
          schedule.push(result);
     }
      startDateTime.setMinutes(startDateTime.getMinutes() + interValTime);
    }

    curentDate.setDate(curentDate.getDate() + 1);
  }
  return schedule;
};

const getAllFormDB = async (params: any, options: IOptions,user:IAuthUser) => {
  const { limit, page, skip } = calculatePagination(options);
  const { startDateTime,endDateTime, ...filterData } = params;
  const andConditions: Prisma.ScheduleWhereInput[] = [];
if (startDateTime && endDateTime) {
  andConditions.push({
    AND:[
      {
        startDateTime:{
          gte:startDateTime
        }
      },
      {
        endDateTime:{
          lte:endDateTime
        }
      }
    ]
  })
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
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

const doctorSchedules = await prisma.doctorSchedule.findMany({
  where:{
    doctor:{
      email:user?.email
    }
  }
})

const doctorScheduleIDS = doctorSchedules.map(schedule=>schedule.scheduleId);


  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id:{
        notIn:doctorScheduleIDS
      }
    },
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
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      startDateTime:true,
      endDateTime:true
    
   
      
    },
  });
  const total = await prisma.schedule.count({
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
export const scheduleService = {
  insertIntoDb,
  getAllFormDB
};
