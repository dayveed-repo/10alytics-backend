import { getUser, updateUser } from "./user.service.js";

export async function getCurrentUser(req, res) {
  const userId = req.user.id;

  const user = await getUser(userId);

  if (user?.id) {
    return res.status(200).json({
      status: "success",
      message: "Fetched user profile successfully",
      user,
    });
  }

  console.log("fetched user", user);
  return res.status(404).json({
    status: "failed",
    message: user.error || "Failed to fetch user profile",
  });
}

export async function updateUserProfileController(req, res) {
  const userId = req.params.userId;

  const user = await updateUser(userId, req.body);

  if (user?.id) {
    return res.status(201).json({
      status: "success",
      message: "Updated user profile successfully",
      user,
    });
  }

  console.log("updated user", user);
  return res.status(422).json({
    status: "failed",
    message: "Failed to update user profile",
  });
}
