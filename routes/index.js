import express from "express";
import db from "../models/index.cjs";

const { Task, User } = db;

const router = express.Router();

router.get("/tasks", async (req, res) => {
  const tasks = await Task.findAll({
    include: {
      model: User,
      as: "User",
    },
    order: [["id", "ASC"]],
  });

  res.json(tasks);
});

router.get("/tasks/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id, {
    include: {
      model: User,
      as: "User",
    },
  });

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  res.json(task);
});

router.get("/users", async (req, res) => {
  const users = await User.findAll({
    order: [["id", "ASC"]],
  });

  res.json(users);
});

router.post("/tasks", async (req, res) => {
  try {
    const { title, dueDate, completed, userId } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "Task title is required",
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        error: "Due date is required",
      });
    }

    if (userId == null) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    const task = await Task.create({
      title,
      dueDate,
      completed: completed ?? false,
      userId,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("POST /tasks ERROR:", error);

    res.status(500).json({
      error: "Failed to create task",
    });
  }
});

router.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  await task.update(req.body);

  res.json(task);
});

router.delete("/tasks/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id);

  if (!task) {
    return res.status(404).json({
      error: "Task not found",
    });
  }

  await task.destroy();

  res.json({
    message: "Deleted",
    task,
  });
});

export default router;
