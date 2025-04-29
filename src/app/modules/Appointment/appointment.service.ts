import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";
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
    return appointmentData;
  });
  return result;
};

export const appointmentService = {
  createAppointment,
};
