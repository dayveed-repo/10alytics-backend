import "dotenv/config";

import pkg from "@prisma/client";

const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";

// Create the adapter using your Neon URL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Instantiate Prisma with adapter
const prisma = new PrismaClient({
  adapter,
  log: ["query", "error"],
});

export default prisma;
