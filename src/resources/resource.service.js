import prisma from "../config/prisma.js";
import publishNotification from "../redis/notification-pub.js";
import { authors } from "../utils/constants.js";

async function sendNotifications(resource, type) {
  const users = await prisma.user.findMany();
  let notifcationMetaData = {};

  if (type === "new") {
    notifcationMetaData = {
      title: "New Resource",
      message: `${resource.title} uploaded`,
      redisEventType: "RESOURCE_CREATED",
    };
  } else {
    notifcationMetaData = {
      title: "Resource Updated",
      message: `${resource.title} has been updated`,
      redisEventType: "RESOURCE_UPDATED",
    };
  }

  if (!Array.isArray(users))
    throw new Error("Failed to fetch users, to process notifications");

  const notifications = users.map((user) => ({
    userId: user.id,
    title: notifcationMetaData.title,
    message: notifcationMetaData.message,
  }));

  await prisma.notification.createMany({
    data: notifications,
  });

  await publishNotification({
    type: notifcationMetaData.redisEventType,
    resourceId: resource.id,
    title: notifcationMetaData.title,
    message: notifcationMetaData.message,
  });
}

export async function createResource(data) {
  const authorIndex = Math.floor(Math.random() * 3);

  const resource = await prisma.resource.create({
    data: {
      ...data,
      author: authors[authorIndex],
    },
  });

  if (!resource?.id) {
    console.log("Resource create error", resource);
    return { error: "An error occured while creating resource" };
  }

  sendNotifications(resource, "new").catch((error) => {
    console.log("Error occured sending notification", resource);
  });

  return resource;
}

export async function editResource(id, data) {
  if (!id) return { error: "Resource ID is required to perform this action" };

  const resource = await prisma.resource.update({
    where: { id },
    data: {
      ...data,
    },
  });

  if (!resource?.id) {
    console.log("Resource update error", resource);
    return { error: "An error occured while editing resource" };
  }

  sendNotifications(resource, "update").catch((error) => {
    console.log("Error occured sending notification", resource);
  });

  return resource;
}

export async function deleteResource(id) {
  if (!id) return { error: "Resource ID is required to perform this action" };

  const resource = await prisma.resource.delete({
    where: { id },
  });

  if (!resource?.id) {
    console.log("Resource delete error", resource);
    return { error: "An error occured while deleting resource" };
  }

  //   sendNotifications(resource, "update").catch((error) => {
  //     console.log("Error occured sending notification", resource);
  //   });

  return resource;
}

export async function likeResource(resourceId, userId) {
  try {
    const existinglike = await prisma.like.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId,
        },
      },
    });

    if (existinglike?.id) {
      const deletedLike = await prisma.like.delete({
        where: {
          userId_resourceId: {
            userId,
            resourceId,
          },
        },
      });

      if (!deletedLike?.id) {
        return { error: "Failed to unlike resource" };
      }

      return { success: true, action: "unlike" };
    } else {
      const like = await prisma.like.create({
        data: {
          userId,
          resourceId,
        },
      });

      if (!like?.id) {
        return { error: "Failed to like resource" };
      }

      return { success: true, action: "like" };
    }
  } catch (error) {
    return { error: error.message };
  }
}

export async function getResources(pageQuery, limitQuery, titleQuery) {
  try {
    const page = Number(pageQuery) || 1;
    const limit = Number(limitQuery) || 10;

    const skip = (page - 1) * limit;

    const resources = await prisma.resource.findMany({
      where: {
        title: {
          contains: titleQuery,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
    });

    return resources;
  } catch (error) {
    console.log("error occured while fetching resources", error);
  }
}

export async function getResource(id) {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource.id) return { error: "Resource not found" };

    const likeCount = await prisma.like.count({
      where: { resourceId: id },
    });

    return { ...resource, likeCount };
  } catch (error) {
    console.log("error occured while fetching resource", error);
  }
}

export async function userLikedResource(resourceId, userId) {
  try {
    if (!resourceId) return { error: "Resource Id is required to proceed" };

    const liked = await prisma.like.findUnique({
      where: {
        userId_resourceId: { userId, resourceId },
      },
    });

    if (liked?.id) return { liked: true };

    return { liked: false };
  } catch (error) {
    console.log("error fetching like for resource for user", error);
  }
}
