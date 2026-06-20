import { Request, Response } from "express";
import Report from "../models/Report.js";

// User creates report
export const createReport = async (req: Request, res: Response) => {
  try {
    const { targetListing, targetUser, reason, attachments } = req.body;

    const report = await Report.create({
      reporter: req.user?.id,
      targetListing: targetListing || null,
      targetUser: targetUser || null,
      reason,
      attachments: attachments || [],
    });

    res.status(201).json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - get all reports
export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "firstName lastName email")
      .populate("targetListing")
      .populate("targetUser")
      .lean();

    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - update report (resolve/reject)
export const updateReport = async (req: Request, res: Response) => {
  try {
    const { status, actionTaken } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }

    report.status = status || report.status;
    report.actionTaken = actionTaken || report.actionTaken;

    await report.save();

    res.json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};