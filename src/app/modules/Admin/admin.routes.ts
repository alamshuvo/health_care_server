import express from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidationSchema } from '../../validation/adminvalidation';


const router = express.Router();

router.get('/',adminController.getAllAdmins)
router.get('/:id',adminController.getSingleAdmin);
router.patch('/:id',validateRequest(AdminValidationSchema.adminValidation),adminController.updateAdmin)
router.delete('/:id',adminController.deleteAdmin);
router.delete("/soft/:id",adminController.softDeleteAdmin);
export const adminRoutes = router;