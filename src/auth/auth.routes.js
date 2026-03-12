import express from "express";
import validateFields from "../middleware/validator.js";
import { signup, login } from "./auth.controller.js";

const router = express.Router();

router.post(
  "/signup",
  validateFields(["firstName", "lastName", "email", "password"]),
  signup,
);
router.post("/login", validateFields(["email", "password"]), login);

export default router;
