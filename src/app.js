import express from "express";
import cors from "cors";
import authRoutes from "./auth/auth.routes.js";
import resourceRoutes from "./resources/resource.routes.js";
import userRoutes from "./users/user.routes.js";
import notificationRoutes from "./notification/notification.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/resources", resourceRoutes);
app.use("/users", userRoutes);
app.use("/notifications", notificationRoutes);

export default app;
