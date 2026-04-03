import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.config.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";
import noteRouter from './routes/note.route.js';
import userRouter from './routes/user.route.js';
import uploadRouter from './routes/upload.route.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "UPDATE", "PATCH"],
    credentials: true,
  })
);
// app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB and start the server if connection is sucessful
connectDB()
  .then(() => {
    // Routes
    app.use("/api/auth", authRouter);
    app.use("/api/notes", noteRouter);
    app.use("/api/user", userRouter);
    app.use("/api/upload", uploadRouter);

    // Global error handling
    app.use(errorHandler);

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to the database. Server not started.");
    console.error(error.message);
  });
