import asyncHandler from "express-async-handler";
import Task from "../../models/tasks/TasksModel.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, daysToComplete, status } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Please add a title" });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Please add a description" });
    }

    if (!daysToComplete || daysToComplete.trim() === "") {
      return res.status(400).json({ message: "Please add days to complete" });
    }

    const task = new Task({
      title,
      description,
      daysToComplete,
      status: status || "active",
      user: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.log("Error creating task: ", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getAllTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    const tasks = await Task.find({ user: userId });
    res.status(200).json({ length: tasks.length, tasks });
  } catch (error) {
    console.log("Error getting task: ", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please provide a task id" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (!task.user.equals(userId)) {
      return res
        .status(401)
        .json({ message: "Unauthorized to access this task" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.log("Error getting task: ", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // task id
    const { title, description, daysToComplete, status } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Please provide a task id" });
    }
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    //check if user is creator
    if (!task.user.equals(userId)) {
      return res
        .status(401)
        .json({ message: "Unauthorized to access this task" });
    }
    // update task with new values
    task.title = title || task.title;
    task.description = description || task.description;
    task.daysToComplete = daysToComplete || task.daysToComplete;
    task.status = status || task.status;
    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    console.log("Error updating task: ", error.message);
    res.status(500).json({ message: error.message });
  }
});

// delete task
export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // task id
    if (!id) {
      // check if task id is provided
      return res.status(400).json({ message: "Please provide a task id" });
    }
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    //check if user is creator
    if (!task.user.equals(userId)) {
      return res
        .status(401)
        .json({ message: "Unauthorized to access this task" });
    }
    // delete task
    await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.log("Error deleting task: ", error.message);
    res.status(500).json({ message: error.message });
  }
});
