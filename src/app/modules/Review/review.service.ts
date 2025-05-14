import status from "http-status";
import { prisma } from "../../../shared/prisma";
import ApiError from "../../errors/apiError";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDb = async (user: IAuthUser, data: any) => {
  const appointmenttData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: data?.appointmentId,
    },
  });
  const patinetData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  if (!(appointmenttData.patientId === patinetData.id)) {
    throw new ApiError(status.BAD_REQUEST, "this is not your appointment");
  }

 return await prisma.$transaction(async(tx)=>{
    const result = await tx.review.create({
        data: {
          appointmentId: appointmenttData?.id,
          doctorId: appointmenttData?.doctorId,
          patientId: appointmenttData?.patientId,
          rating: data?.rating,
          comment: data?.comment,
        },
      });
      const avgRating = await tx.review.aggregate({
        _avg:{rating:true}
      })
      await tx.doctor.update({
        where:{
            id:result.doctorId
        },
        data:{
            averageRating:avgRating._avg.rating as number
        }
      })
      return result
 })
 
 
};

export const reviewService = {
  insertIntoDb,
};
