import express from "express";
import { createSupportRequest} from "../controllers/support.controller.js";

const router = express.Router();

// Public route to submit support request
router.post("/", createSupportRequest);

// Admin route to view all support requests (optional, protect this route with auth middleware)

export default router;
