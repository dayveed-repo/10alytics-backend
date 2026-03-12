import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  fetchUserNotificationsController,
  fetchUserNotificationsCountController,
  readUserNotificationsController,
} from "./notification.controller.js";

const router = express.Router();

router.get("/:userId", auth, fetchUserNotificationsController);
router.get("/:userId/counts", auth, fetchUserNotificationsCountController);
router.get("/read/:userId", auth, readUserNotificationsController);

export default router;
