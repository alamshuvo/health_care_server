import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";
import { IOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/pagination.helper";
import { Prisma, userRole } from "@prisma/client";
const createAppointment = async (payload: any, user: IAuthUser) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const isDoctorExist = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });
  await prisma.doctorSchedule.findFirstOrThrow({
    where: {
      doctorId: isDoctorExist.id,
      scheduleId: payload.shceduleId,
      isBooked: false,
    },
  });
  const vedioCallingId = uuidv4();
  payload.patientId = patientData.id;
  payload.vedioCallingId = vedioCallingId;

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: payload.patientId,
        doctorId: isDoctorExist.id,
        scheduleId: payload.scheduleId,
        vedioCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedule.update({
      where: {
        doctorId_scheduleId: {
          doctorId: isDoctorExist.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });
    // companyName-date-time
    const today = new Date();

    const transactionId =
      "ph-healthCare-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes();

    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: isDoctorExist.appointmentFee,
        transctionId: transactionId,
      },
    });
    return appointmentData;
  });
  return result;
};

const getAppointment = async (
  user: IAuthUser,
  filters: any,
  options: IOptions
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { ...filterData } = filters;
  const andConditions: Prisma.AppointmentWhereInput[] = [];

  if (user?.role === userRole.PATIENT) {
    andConditions.push({
      patient:{
        email: user?.email,
      }
    })
  }
  if (user?.role === userRole.DOCTOR) {
    
    andConditions.push({
      doctor:{
        email: user?.email,
      }
    })
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);

    const whereConditions: Prisma.AppointmentWhereInput =
      andConditions.length > 0
        ? {
            AND: andConditions,
          }
        : {};
    const result = await prisma.appointment.findMany({
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
       include:user?.role === userRole.PATIENT?
       {doctor:true,schedule:true}: {patient:{include:{medicalReport:true,patientHealthData:true}},schedule:true},
    });
   
    const total = await prisma.appointment.count({
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
  }
};


const changeAppointmentStatus = async()=>{

}
export const appointmentService = {
  createAppointment,
  getAppointment,
  changeAppointmentStatus
};
