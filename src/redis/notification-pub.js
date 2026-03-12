import redis from "../config/redis.js";

const publishNotification = async (data) => {
  await redis.publish("notifications", JSON.stringify(data));
};

export default publishNotification;
