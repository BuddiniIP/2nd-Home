import express from 'express';

const router = express.Router();

const mockPayments = [
  { id: 1, studentId: 1, amount: 25000, date: "2026-05-01", type: "Online", status: "Paid" },
  { id: 2, studentId: 1, amount: 25000, date: "2026-06-01", type: "Physical", status: "Pending" },
];

// GET payment history
router.get('/', (req, res) => {
  res.json(mockPayments);
});

// POST create payment (Student)
router.post('/', (req, res) => {
  const newPayment = { ...req.body, id: Date.now(), status: req.body.type === 'Online' ? 'Paid' : 'Pending' };
  res.json({ success: true, payment: newPayment });
});

// PUT confirm physical payment (Owner)
router.put('/:id/confirm', (req, res) => {
  res.json({
    success: true,
    message: 'Payment confirmed by owner',
    paymentId: req.params.id
  });
});

// POST remind owner (Student)
router.post('/:id/remind', (req, res) => {
  res.json({
    success: true,
    message: 'Reminder sent to the boarding owner'
  });
});

export default router;
