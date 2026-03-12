import {
  getUserNotifications,
  getUserNotificationsCount,
  markUserNotificationsAsRead,
} from "./notification.service.js";

export async function fetchUserNotificationsController(req, res) {
  const userId = req.params.userId;

  const userNotifications = await getUserNotifications(userId);

  if (Array.isArray(userNotifications)) {
    return res.status(200).json({
      status: "success",
      message: "Fetched user notifications successfully",
      notifications: userNotifications,
    });
  }

  console.log("fetched user notifications", userNotifications);
  return res.status(404).json({
    status: "failed",
    message: "Failed to fetch user notifcations",
  });
}

export async function fetchUserNotificationsCountController(req, res) {
  const userId = req.params.userId;
  const read = req.query.read;

  const userNotifications = await getUserNotificationsCount(userId, read);

  if (userNotifications) {
    return res.status(200).json({
      status: "success",
      message: "Fetched user notifications successfully",
      notificationsCount: userNotifications,
    });
  }

  console.log("fetched user notifications count", userNotifications);
  return res.status(404).json({
    status: "failed",
    message: "Failed to fetch user notifcations",
  });
}

export async function readUserNotificationsController(req, res) {
  const userId = req.params.userId;

  const updatedNots = await markUserNotificationsAsRead(userId);

  if (updatedNots?.count || updatedNots?.count === 0) {
    return res.status(200).json({
      status: "success",
      message: "Marked user notifications as read successfully",
    });
  }

  console.log("marked user notifications as read", updatedNots);
  return res.status(404).json({
    status: "failed",
    message: "Failed to mark user notifications as read",
  });
}
