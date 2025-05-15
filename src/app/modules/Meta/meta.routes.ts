import express from 'express';
import { MetaController } from './meta.controller';
import auth from '../../middlewares/authMiddleware';
import { userRole } from '@prisma/client';

const route = express.Router();

route.get("/",auth(userRole.SUPER_ADMIN,userRole.ADMIN,userRole.DOCTOR,userRole.PATIENT),MetaController.fetchDashboardMetaData)
export const MetaRoutes = route