import axios from 'axios'
import config from '../../../config';
import { prisma } from '../../../shared/prisma';
import { sslService } from '../SSL/ssl.service';
const initPayment = async(appointmentId:string)=>{
  const paymentData = await prisma.payment.findFirstOrThrow({
    where:{appointmentId},
    include:{
      appointment:{
        include:{
          patient:true
        }
      }
    }
  })
  console.log(paymentData);
const initPaymentData = {
  amount:paymentData.amount,
  transcationId:paymentData.transctionId,
  name:paymentData?.appointment.patient.name,
  email:paymentData?.appointment.patient.email,
  address:paymentData?.appointment.patient.address,
  contactNumber:paymentData?.appointment.patient.contactNumber
}
const result = await sslService.initPayment(initPaymentData)

return {
  paymentURL:result
}

}

export const paymentService = {
    initPayment
}