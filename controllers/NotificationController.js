import Notification from "../models/Notification.js";


export async function getNotifications(req, res) {
    const userId = req.params.userId;
  
    Notification.find({ userId: userId })
    .populate("likedBy")
      .then((notifications) => {
        res.status(200).json({ notifications: notifications });
      })
      .catch((error) => {
        res.status(500).json({ message: 'Failed to get notifications' });
      });
  }