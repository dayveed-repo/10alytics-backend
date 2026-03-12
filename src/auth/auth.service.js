import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

async function signup({ firstName, lastName, email, password }) {
  const hash = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser?.id) return { error: "User with this email already exist" };

  const savedUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hash,
    },
  });

  return savedUser;
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    },
  });

  if (!user?.id) return { error: "User not found" };

  const match = await bcrypt.compare(password, user.password);

  if (!match) return { error: "Invalid credentials" };

  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id: user.id,
  };
  const token = await jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return { token, user: userData };
}

export default { signup, login };
