import auth from "../middleware/auth.middleware.js";
import express from "express";
import {
  getCurrentUser,
  updateUserProfileController,
} from "./user.controller.js";
import validateFields from "../middleware/validator.js";

const router = express.Router();

router.get("/profile", auth, getCurrentUser);
router.put(
  "/:userId",
  validateFields(["firstName", "lastName", "email"], true),
  auth,
  updateUserProfileController,
);

export default router;
