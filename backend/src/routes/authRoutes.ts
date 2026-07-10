import express from 'express';
import { registerUser, loginUser, getMe, updateProfile, uploadProfilePicture, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getProfileUpload } from '../config/cloudinary.js';

const profileUpload = getProfileUpload();
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.post('/upload/profile', protect, profileUpload.single('profilePicture'), uploadProfilePicture);

export default router;
