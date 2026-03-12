import prisma from "../config/prisma.js";
import publishNotification from "../redis/notification-pub.js";

export async function createNotification(userId, title, message) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });

    if (notification?.id) {
      await publishNotification({
        userId,
        title,
        message,
      });
    }

    return notification;
  } catch (error) {
    console.log("an error occured while processing notification: ", error);
  }
}

export async function getUserNotifications(userId) {
  if (!userId) return { error: "User Id is required" };

  const userNotifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return userNotifications;
}

export async function getUserNotificationsCount(userId, read) {
  if (!userId) return { error: "User Id is required" };
  let queryObj = {};

  if (read) {
    queryObj = { read: read === "true" ? true : false };
  }

  const userNotifications = await prisma.notification.count({
    where: { userId, ...queryObj },
  });

  return userNotifications;
}

export async function markUserNotificationsAsRead(userId) {
  if (!userId) return { error: "User Id is required" };

  const userNotifications = await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });

  return userNotifications;
}
