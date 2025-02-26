import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User";

const JWT_SECRET = process.env.JWT_SECRET || "5as4d4a56465HGHJBASBHJ56458YYGHJHJGHGioasoioi56456";

export const registerUser = async (
  email: string,
  password: string,
  role: "user" | "admin"
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword, role });

  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token, user };
};
