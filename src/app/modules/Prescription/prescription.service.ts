import { appointmentStatus, paymentStatus } from "@prisma/client";
import { prisma } from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDb = async(user:IAuthUser,payload:any)=>{
 const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where:{
        id:payload.appointmentId,
        status:appointmentStatus.COMPLETED,
        paymentStatus:paymentStatus.PAID
    }
 })
 console.log(appointmentData);
}

export const prescriptionService = {
    insertIntoDb
}