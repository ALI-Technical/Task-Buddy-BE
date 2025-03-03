import express from "express";
import { getUserTasks, createTask, updateTask, getAllTasks, deleteTask, changeTaskStatus } from "../Controllers/taskController";
import {authenticateUser, authorizeAdmin} from "../Middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticateUser, getUserTasks);
router.post("/", authenticateUser, createTask);
router.patch("/:taskId", authenticateUser, updateTask);
router.patch("/status/:taskId", authenticateUser, changeTaskStatus);
router.delete("/:taskId", authenticateUser, deleteTask);
router.get("/getAllTasks", authenticateUser, authorizeAdmin, getAllTasks); // Admin-only route

export default router;
