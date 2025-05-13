import axios from "axios";
import config from "../../../config";
import ApiError from "../../errors/apiError";
import status from "http-status";

const initPayment = async(paymentData:any)=>{
  try {
    const data = {
        store_id:config.ssl.storeId,
        store_passwd:config.ssl.storePassword,
        total_amount:paymentData?.amount,
        currency: 'BDT',
        tran_id: paymentData?.transcationId, // use unique tran_id for each api call
        success_url: config.ssl.sucessURL,
        fail_url: config.ssl.failedURL,
        cancel_url: config.ssl.cancelURL,
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method:'N/A',
        product_name: 'Appointment',
        product_category: 'Service',
        product_profile: 'general',
        cus_name: paymentData?.name,
        cus_email: paymentData?.email,
        cus_add1: paymentData?.address,
        cus_add2:paymentData?.address ,
        cus_city: 'N/A',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone:  paymentData?.contactNumber,
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
  const response = await axios ({
    method:'post',
    url:config.ssl.sslPaymentUrl,
    data:data,
    headers:{
      'Content-Type':"application/x-www-form-urlencoded"
    }
  })
 return response.data.GatewayPageURL
  } catch (error) {
    throw new ApiError(status.BAD_REQUEST,"Payment error occured")
  }
}

export const sslService = {
    initPayment
}