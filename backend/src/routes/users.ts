import express from 'express';

const router = express.Router();

// GET profile
router.get('/profile', (req, res) => {
  res.json({
    id: 1,
    name: "Sachintha K.",
    email: "sachintha@uni.ac.lk",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
  });
});

// PUT update profile
router.put('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: req.body
  });
});

// POST update profile picture
router.post('/profile/picture', (req, res) => {
  // Simulation: File upload would happen here
  res.json({
    success: true,
    message: 'Profile picture updated',
    avatarUrl: 'https://new-avatar-url.com'
  });
});

export default router;
