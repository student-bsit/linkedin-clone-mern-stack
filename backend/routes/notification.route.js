import express from 'express';
import isAuth from '../middleware/auth.middleware.js';
import { clearAllNotifications, deleteNotification, getNotification } from '../controllers/notification.controller.js';

const notificationRouter=express.Router();

notificationRouter.get("/get",isAuth,getNotification)
notificationRouter.delete("/deleteOne/:id",isAuth,deleteNotification)
notificationRouter.get("/",isAuth,clearAllNotifications)
export default notificationRouter;