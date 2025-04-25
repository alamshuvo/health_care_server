import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { authRoutes } from "../modules/Auth/auth.routes";
import { specialtyRoutes } from "../modules/Specialties/specialities.route";
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
    path:"/auth",
    route:authRoutes
  },
  {
    path:"/speciality",
    route:specialtyRoutes
  }
];

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route);
})

export default router;
