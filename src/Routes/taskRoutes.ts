import express from "express";
import { getUserTasks, createTask, updateTask, getAllTasks } from "../Controllers/taskController";
import {authenticateUser, authorizeAdmin} from "../Middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateUser, getUserTasks);
router.post("/", authenticateUser, createTask);
router.put("/:taskId", authenticateUser, updateTask);
router.get("/getAllTasks", authenticateUser, authorizeAdmin, getAllTasks); // Admin-only route

export default router;
