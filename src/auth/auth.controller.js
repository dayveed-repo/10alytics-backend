import authService from "./auth.service.js";

export async function signup(req, res) {
  const user = await authService.signup(req.body);

  if (user?.id) {
    return res
      .status(201)
      .json({ status: "success", message: "Signed up Successfully", user });
  }

  return res.status(400).json({
    ...user,
    status: "failed",
    message: user.error || "Failed to signup",
  });
}

export async function login(req, res) {
  const loginData = await authService.login(req.body);

  if (loginData?.token) {
    return res.status(200).json({
      status: "success",
      message: "Login Successful",
      ...loginData,
    });
  }

  return res
    .status(401)
    .json({ ...loginData, status: "failed", message: "Failed to login" });
}
