import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { authRoutes } from "../modules/Auth/auth.routes";
import { specialtyRoutes } from "../modules/Specialties/specialities.route";
import { doctorRoutes } from "../modules/Doctor/doctor.routes";
import { patientRoutes } from "../modules/Patient/patient.routes";
import { scheduleRoutes } from "../modules/Schedule/schedule.routes";
import { doctorScheduleRoutes } from "../modules/DoctorSchedule/doctorSchedule.routes";
import { appointmentRoutes } from "../modules/Appointment/appointment.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { PrescriptionRoutes } from "../modules/Prescription/prescription.route";
import { ReviewRoutes } from "../modules/Review/review.route";
import { MetaRoutes } from "../modules/Meta/meta.routes";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/speciality",
    route: specialtyRoutes,
  },
  {
    path: "/doctor",
    route: doctorRoutes,
  },
  {
    path: "/patient",
    route: patientRoutes,
  },
  {
    path: "/schedule",
    route: scheduleRoutes,
  },
  {
    path: "/doctor-schedule",
    route: doctorScheduleRoutes,
  },
  {
    path: "/appointment",
    route: appointmentRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/prescription",
    route: PrescriptionRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/meta",
    route: MetaRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
