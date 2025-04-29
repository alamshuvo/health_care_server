import express from 'express'
import { scheduleController } from './schedule.controller';
const route  = express.Router();

route.post("/",scheduleController.insertIntoDb)

export const scheduleRoutes =  route