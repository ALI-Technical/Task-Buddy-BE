import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "5as4d4a56465HGHJBASBHJ56458YYGHJHJGHGioasoioi56456";

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction): any => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};
