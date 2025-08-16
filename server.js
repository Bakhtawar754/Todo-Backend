import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Debug logging
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err));

// Routes
import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes); // <-- frontend should call /api/portfolio

app.listen(5000, () => console.log("Server running on port 5000............"));
