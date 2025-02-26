import { Router } from "express";
import { handleLoginUser, handleRegisterUser } from "../Controllers/authController";

const router = Router();

router.post("/register", handleRegisterUser);
router.post("/login", handleLoginUser);

export default router;
