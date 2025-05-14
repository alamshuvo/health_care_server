import { appointmentStatus, paymentStatus, prescription } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import ApiError from "../../errors/apiError";
import status from "http-status";
import { IOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/pagination.helper";

const insertIntoDb = async (
  user: IAuthUser,
  payload: Partial<prescription>
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      status: appointmentStatus.COMPLETED,
      paymentStatus: paymentStatus.PAID,
    },
    include: {
      doctor: true,
    },
  });
  if (!(user?.email === appointmentData?.doctor.email)) {
    throw new ApiError(status.BAD_REQUEST, "this is not your apointment");
  }
  const result = await prisma.prescription.create({
    data: {
      appointmentId: appointmentData?.id,
      doctorId: appointmentData?.doctor.id,
      patientId: appointmentData.patientId,
      instructions: payload.instructions as string,
      followUpDate: payload.followUpDate ?? new Date(),
    },
    include: {
      patient: true,
    },
  });
  return result;
};

const patientPrascription = async (user: IAuthUser, options: IOptions) => {
  const { limit, page, skip } = calculatePagination(options);
  const patientData = await prisma.prescription.findMany({
    where: {
      patient: {
        email: user?.email,
      },
    },
    skip,
    take:limit,
    orderBy:options.sortBy && options.sortOrder ? {[options.sortBy]:options.sortOrder}:{createdAt:"desc"},
    include:{
        doctor:true,
        patient:true,
        appointment:true
    }
  });
  const total = await prisma.prescription.count({
    where: {
        patient: {
          email: user?.email,
        },
      },
  })
  return {
    meta:{
        total,
        page,
        limit
    },
    data:patientData
  };
};

export const prescriptionService = {
  insertIntoDb,
  patientPrascription,
};
