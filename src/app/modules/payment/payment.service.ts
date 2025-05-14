
import { prisma } from "../../../shared/prisma";
import { IPaymentData } from "../SSL/ssl.interface";
import { sslService } from "../SSL/ssl.service";
import { paymentStatus } from "@prisma/client";
const initPayment = async (appointmentId: string) => {
  console.log(appointmentId);
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: { appointmentId },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });
  console.log(paymentData);
  const initPaymentData = {
    amount: paymentData.amount,
    transcationId: paymentData.transctionId,
    name: paymentData?.appointment.patient.name,
    email: paymentData?.appointment.patient.email,
    address: paymentData?.appointment.patient.address,
    contactNumber: paymentData?.appointment.patient.contactNumber,
  };
  const result = await sslService.initPayment(initPaymentData);

  return {
    paymentURL: result,
  };
};

const validatePayment = async (payload: any) => {
  // for deployment 
  // if (!payload || !payload.status || !(payload.status === "VALID")) {
  //   return {
  //     message: "Invalid payment",
  //   };
  // }

  // const response = await sslService.validatePayment(payload);

  // if (response?.status !== "VALID") {
  //   return {
  //     message: "payment failed",
  //   };
  // }


 const response = payload  // for localhost 
  await prisma.$transaction(async (tx) => {
  const updatedPaymentData = await tx.payment.update({
      where: {
        transctionId: response.tran_id,
      },
      data: {
        status: paymentStatus.PAID,
        paymentGatewayData: response,
      },
    });
 
    await tx.appointment.update({
      where:{
        id:updatedPaymentData.appointmentId
      },data:{
        paymentStatus:paymentStatus.PAID
      }
    })


  });

  return {
    message:"Payment sucess"
  }
};

export const paymentService = {
  initPayment,
  validatePayment,
};
