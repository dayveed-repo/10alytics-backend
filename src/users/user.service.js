import prisma from "../config/prisma.js";

export async function getUser(userId) {
  if (!userId) return { error: "User Id is required" };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      gender: true,
      phoneNumber: true,
      imageUrl: true,
    },
  });

  if (!user?.id) return { error: "User not found" };

  return user;
}

export async function updateUser(userId, data) {
  if (!userId) return { error: "User Id is required" };

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
    },
  });

  if (!user?.id) return { error: "Failed to update user" };

  return user;
}
