import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err));

// Routes
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todo.js";
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.listen(5000, () => console.log("Server running on port 5000............"));
