import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../controllersAuth/task/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/task/create", protect, createTask);

// get all tasks
router.get("/tasks", protect, getAllTasks);

// get single task
router.get("/task/:id", protect, getTask);

// update task
router.patch("/task/:id", protect, updateTask);

// delete task
router.delete("/task/:id", protect, deleteTask);

export default router;
