import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors(
  {
  origin: [
    "http://localhost:5173",   // if your frontend runs here
    "http://localhost:5175",   // if your frontend runs here
    "https://todo-backend-production-81ea.up.railway.app" // your deployed backend
    // later you’ll add your deployed frontend (like Vercel domain)
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}
));
app.use(express.json());

// Debug logging (optional, helps in Railway logs)
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.originalUrl);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);

// ✅ Railway requires dynamic PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}...`));

