import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerUser, loginUser, getMe, updateProfile, uploadProfilePicture } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const profileStorage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../uploads/profiles'),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const profileUpload = multer({ storage: profileStorage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.post('/upload/profile', protect, profileUpload.single('profilePicture'), uploadProfilePicture);

export default router;
