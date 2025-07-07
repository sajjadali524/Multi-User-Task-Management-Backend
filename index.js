import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRoute from "./routes/user.routes.js";
import taskRoute from "./routes/task.routes.js";
dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

// apis
app.use("/api/auth", userRoute);
app.use("/api/task", taskRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`server is running on PORT ${PORT}`)
});