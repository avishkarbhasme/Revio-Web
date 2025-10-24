import Report from "../models/report.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a new report
const createReport = asyncHandler(async (req, res) => {
  const { type, reason, description, reportedBy, reportedItemId } = req.body;

  // Validate required fields
  if (!type || !reason || !description) {
    throw new ApiError({ message: "Type, reason, and description are required", statusCode: 400 });
  }

  const report = await Report.create({
    type,
    reason,
    description,
    reportedBy,
    reportedItemId,
  });

  res.status(201).json(
    new ApiResponse({
      message: "Report submitted successfully",
      data: report,
    })
  );
});

// Get all reports (admin)
const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate("reportedBy", "username email")
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse({
      message: "Reports fetched successfully",
      data: reports,
    })
  );
});

export { createReport, getAllReports };
