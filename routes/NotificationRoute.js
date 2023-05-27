import express from 'express';
import { getNotifications } from '../controllers/NotificationController.js';
const router=express.Router();

router.route("/getNotifications/:userId").get(getNotifications)

export default router