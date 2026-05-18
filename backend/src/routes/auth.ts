import express from 'express';

const router = express.Router();

// Mock Auth Controller
router.post('/login', (req, res) => {
  const { username, password, role } = req.body;
  // Simulation: Accept any login
  res.json({
    success: true,
    user: {
      id: 1,
      username,
      role: role || 'student',
      name: username === 'nimal' ? 'Mr. Nimal' : 'Sachintha K.'
    },
    token: 'mock-jwt-token'
  });
});

router.post('/signup', (req, res) => {
  const userData = req.body;
  res.json({
    success: true,
    message: 'User registered successfully',
    user: { ...userData, id: Date.now() }
  });
});

export default router;
