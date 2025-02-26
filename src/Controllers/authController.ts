import { registerUser, loginUser } from "../Services/authService";
import { Request, Response } from "express";

export const handleRegisterUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await registerUser(email, password, role || "user");
    res.status(201).json({ message: "User registered", user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const handleLoginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const { token, user } = await loginUser(email, password);
    res.status(200).json({ message: "Login successful", token, user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
