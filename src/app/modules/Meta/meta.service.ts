import { paymentStatus, userRole } from "@prisma/client";
import { IAuthUser } from "../../interfaces/common";
import { prisma } from "../../../shared/prisma";

const fetchDashboardMetaData = async (user: IAuthUser) => {
  let metaData;
  switch (user?.role) {
    case userRole.SUPER_ADMIN:
      metaData = getSuperAdminMetaData();
      break;
    case userRole.ADMIN:
      metaData = getAdminMetaData();
      break;
    case userRole.DOCTOR:
      metaData = getDoctorMetaData(user as IAuthUser);
      break;
    case userRole.PATIENT:
      metaData = getPatientMetaData(user as IAuthUser);
      break;

    default:
      throw new Error("Invalid user role");
  }
  return metaData;
};

const getSuperAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const adminCount = await prisma.admin.count();
  const paymentCount = await prisma.payment.count();
  const totalRevinue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where:{
        status:paymentStatus.PAID
    }
  });
 const barChartData = await getBarChartData();
 const piChartData = await getPiChartData()
  return {
    appointmentCount,
    patientCount,
    doctorCount,
    adminCount,
    paymentCount,
    totalRevinue,
    barChartData,
    piChartData
  };
};

const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();
  const totalRevinue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where:{status:paymentStatus.PAID}
  });
  const barChartData = await getBarChartData();
  const piChartData = await getPiChartData()
  return {appointmentCount,patientCount,doctorCount,paymentCount,totalRevinue,barChartData,piChartData}
};

const getDoctorMetaData = async (user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });
  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status:paymentStatus.PAID
    },
  });
  const appointmentStatusDistrubution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      doctorId: doctorData.id,
    },
  });
  const formatedAppointmentStatusDistrubution =
    appointmentStatusDistrubution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));
 return {appointmentCount,patientCount:patientCount.length,reviewCount,totalRevenue,formatedAppointmentStatusDistrubution}
};
// some code added 

const getPatientMetaData = async (user: IAuthUser) => {
  const PatientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: PatientData.id,
    },
  });
  const precriptionCount = await prisma.prescription.count({
    where: {
      patientId: PatientData.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: PatientData.id,
    },
  });

  const appointmentStatusDistrubution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    },
    where: {
      patientId: PatientData.id,
    },
  });
  const formatedAppointmentStatusDistrubution =
    appointmentStatusDistrubution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));
 return {appointmentCount,precriptionCount,reviewCount,formatedAppointmentStatusDistrubution}
};


const getBarChartData = async()=>{
 const appointmentCountByMonth:{month:Date,count:bigint}[] = await prisma.$queryRaw`
    SELECT DATE_TRUNC('month',"createdAt")AS month,
   CAST( COUNT(*)AS INTEGER) AS count 
    FROM "appointment"
    GROUP BY month 
    ORDER BY month ASC 
 `

 return appointmentCountByMonth
}

const getPiChartData = async()=>{
  const appointmentStatusDistrubution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: {
      id: true,
    }
  });
  const formatedAppointmentStatusDistrubution =
    appointmentStatusDistrubution.map((count) => ({
      status: count.status,
      count: Number(count._count.id),
    }));
    return formatedAppointmentStatusDistrubution;
}
export const MetaDataService = {
  fetchDashboardMetaData,
  getBarChartData
};
