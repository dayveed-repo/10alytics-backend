import express from "express";
import validateFields from "../middleware/validator.js";
import auth from "../middleware/auth.middleware.js";
import {
  createResourceController,
  deleteResourceController,
  editResourceController,
  getOneResourceController,
  getResourcesController,
  toggleLikeResourceController,
  userLikedResourceController,
} from "./resource.controller.js";

const router = express.Router();

router.get("/", auth, getResourcesController);

router.post(
  "/",
  validateFields([
    "title",
    "content",
    "thumbnailUrl",
    "videoUrl",
    "videoDurationInMins",
  ]),
  auth,
  createResourceController,
);

router.get("/:resourceId", auth, getOneResourceController);

router.put(
  "/:resourceId",
  validateFields(
    ["title", "content", "thumbnailUrl", "videoUrl", "videoDurationInMins"],
    true,
  ),
  auth,
  editResourceController,
);

router.delete("/:resourceId", auth, deleteResourceController);
router.get("/:resourceId/like", auth, toggleLikeResourceController);
router.get("/:resourceId/liked", auth, userLikedResourceController);

export default router;
