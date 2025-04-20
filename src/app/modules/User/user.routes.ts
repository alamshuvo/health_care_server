import express from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/authMiddleware';
import { userRole } from '@prisma/client';

const router = express.Router();
router.post("/",auth(userRole.ADMIN),userController.createAdmin);



export const userRoutes = router;