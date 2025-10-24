import express from "express";
import { createReport, getAllReports } from "../controllers/report.controller.js";

const router = express.Router();

// Public route to submit a report
router.post("/create", createReport);

// Admin route to get all reports
router.get("/get", getAllReports);

export default router;
