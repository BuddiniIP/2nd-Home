import express from 'express';

const router = express.Router();

// Mock reports data
let mockReports = [
  {
    id: 1,
    boardingId: 1,
    boardingName: "Green View Premium Hostel",
    reporterName: "John Doe",
    reason: "The facilities do not match the description.",
    status: "pending",
    createdAt: new Date().toISOString()
  }
];

// GET all reports (for admins)
router.get('/', (req, res) => {
  res.json(mockReports);
});

// POST a new report (for students)
router.post('/', (req, res) => {
  const { boardingId, boardingName, reporterName, reason } = req.body;
  
  const newReport = {
    id: mockReports.length + 1,
    boardingId,
    boardingName,
    reporterName: reporterName || "Anonymous Student",
    reason,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  
  mockReports.push(newReport);
  
  res.status(201).json({
    success: true,
    message: 'Report submitted successfully',
    report: newReport
  });
});

// POST warn owner
router.post('/:id/warn', (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = mockReports.find(r => r.id === reportId);
  
  if (report) {
    report.status = "warned";
    res.json({
      success: true,
      message: `Warning issued to the owner of ${report.boardingName}`
    });
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

// DELETE boarding (remove boarding associated with report)
router.delete('/:id/boarding', (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = mockReports.find(r => r.id === reportId);
  
  if (report) {
    // In a real app, we would delete the boarding from the database here
    report.status = "removed";
    res.json({
      success: true,
      message: `Boarding ${report.boardingName} has been removed`
    });
  } else {
    res.status(404).json({ message: 'Report not found' });
  }
});

export default router;
