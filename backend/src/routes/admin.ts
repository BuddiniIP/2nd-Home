import express from 'express';

const router = express.Router();

// Mock Statistics Data for Growth Graph
router.get('/stats', (req, res) => {
  res.json({
    growthData: [
      { month: 'Jan', users: 120, revenue: 45000 },
      { month: 'Feb', users: 210, revenue: 82000 },
      { month: 'Mar', users: 450, revenue: 150000 },
      { month: 'Apr', users: 800, revenue: 290000 },
      { month: 'May', users: 1240, revenue: 480000 },
    ],
    summary: {
      totalUsers: 1240,
      studentCount: 950,
      ownerCount: 290,
      activeBoardings: 85,
      monthlyRevenue: 480000,
      pendingReports: 4
    }
  });
});

// Mock Payments Data
router.get('/payments', (req, res) => {
  res.json([
    { id: 'TXN001', user: 'Kasun T.', amount: 18000, boarding: 'Green View Hostel', date: '2026-05-11', status: 'Success' },
    { id: 'TXN002', user: 'Amali P.', amount: 25000, boarding: 'Premium Residence', date: '2026-05-10', status: 'Success' },
    { id: 'TXN003', user: 'Nimal S.', amount: 15000, boarding: 'City Central', date: '2026-05-09', status: 'Pending' },
    { id: 'TXN004', user: 'Dilini W.', amount: 20000, boarding: 'Lake Side', date: '2026-05-08', status: 'Success' },
  ]);
});

// Mock Messages Data
router.get('/messages', (req, res) => {
  res.json([
    { id: 1, sender: 'Kamal Perera', email: 'kamal@gmail.com', subject: 'Inquiry about pricing', message: 'I want to know if there are any student discounts available.', date: '2026-05-12', unread: true },
    { id: 2, sender: 'Sunil Silva', email: 'sunil@yahoo.com', subject: 'Bug report', message: 'The search filter is not working properly on mobile.', date: '2026-05-11', unread: false },
    { id: 3, sender: 'Anne Marie', email: 'anne@outlook.com', subject: 'Property Listing', message: 'How can I list my apartment as a boarding house?', date: '2026-05-10', unread: true },
  ]);
});

export default router;
