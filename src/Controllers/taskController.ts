import { Request, Response } from "express";
import Task from "../Models/Task";
import { io } from "../Config/socket";

interface AuthRequest extends Request {
  user?: any;
}

// Get tasks of logged-in user
export const getUserTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({ message: "Title and Description are required" });
      return;
    }

    const userId = req.user.userId;

    const newTask = new Task({ userId, title, description });
    await newTask.save();

    // Emit event to admins when a new task is created
    io.emit("newTask", newTask);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a task
export const updateTask = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;
    const { title, description, completed } = req.body;

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed ?? task.completed;

    await task.save();

    // Emit event to admins when a task is updated
    io.emit("taskUpdated", task);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
export const deleteTask = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    const task = await Task.findOneAndDelete({ _id: taskId, userId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Emit event to notify all admins about task deletion
    io.emit("taskDeleted", taskId);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Change task status (Completed / Pending)
export const changeTaskStatus = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;
    const { completed } = req.body;

    const task = await Task.findOne({ _id: taskId, userId, reminder: false });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = completed;
    await task.save();

    // Emit event to notify all admins about task status change
    io.emit("taskStatusChanged", { taskId, completed });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: Get all tasks
export const getAllTasks = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
