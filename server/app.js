import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";

import connectDB from "./config/db.config.js";
import errorHandler from "./middlewares/error.middleware.js";

import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";
import userRouter from "./routes/user.route.js";
import uploadRouter from "./routes/upload.route.js";

const app = express();

/* -------------------- CORS CONFIG -------------------- */

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps / postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

/* 🔥 HANDLE PREFLIGHT */
app.options("*", cors());

/* 🔥 EXTRA SAFETY FOR VERCEL */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* -------------------- MIDDLEWARES -------------------- */

app.use(express.json());

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);
app.use("/api/user", userRouter);
app.use("/api/upload", uploadRouter);

/* -------------------- ERROR HANDLER -------------------- */

app.use(errorHandler);

/* -------------------- DB + SERVER -------------------- */

const startServer = async () => {
  try {
    await connectDB();

    // Only run listen in development (local)
    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("DB connection failed:", error.message);
  }
};

startServer();

/* -------------------- EXPORT (FOR VERCEL) -------------------- */

export default app;
