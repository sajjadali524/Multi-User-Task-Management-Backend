import express from "express";
import { createTask } from "../controllers/task.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-task", isAuthenticated, createTask);

export default router;