import express from "express";
import { assignTask, createTask, deleteTask, fetchAllTask, updateTask } from "../controllers/task.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-task", isAuthenticated, createTask);
router.get("/fetch-task", isAuthenticated, fetchAllTask);
router.delete("/delete-task/:id", isAuthenticated, deleteTask);
router.patch("/update-task/:id", isAuthenticated, updateTask);
router.get("/fetch-assign-task", isAuthenticated, assignTask);

export default router;