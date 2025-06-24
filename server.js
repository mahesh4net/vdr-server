import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// ✅ Recommended CORS configuration
const allowedOrigins = [
  "https://virtual-deal-room-v8.vercel.app",
  "http://localhost:5173", // helpful during local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/admin", adminRoutes);

connectDB()
  .then(() => app.listen(process.env.PORT, () => console.log("Server running")))
  .catch((err) => console.error(err));
