import express from "express";
import jwt from "jsonwebtoken";
import Todo from "../models/potfolio.js";

const router = express.Router();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

// Create To-Do
router.post("/", authMiddleware, async (req, res) => {
  const todo = new Todo({ text: req.body.text, userId: req.userId });
  await todo.save();
  res.json(todo);
});

// Get all To-Dos
router.get("/", authMiddleware, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId });
  res.json(todos);
});

// Toggle Complete
router.put("/:id", authMiddleware, async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
