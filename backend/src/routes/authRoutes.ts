import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerUser, loginUser, getMe, updateProfile, uploadProfilePicture } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp)$/i;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const sanitizeFilename = (originalname: string): string => {
  return originalname.replace(/[^a-zA-Z0-9._-]/g, '').replace(/\.\.+/g, '.');
};

const profileStorage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../uploads/profiles'),
  filename: (_req, file, cb) => {
    const safeName = sanitizeFilename(file.originalname);
    cb(null, `${Date.now()}-${safeName}`);
  },
});
const profileUpload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extOk = ALLOWED_EXTENSIONS.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = ALLOWED_MIME.includes(file.mimetype);
    if (!extOk || !mimeOk) {
      cb(new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed'));
      return;
    }
    cb(null, true);
  },
});

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.post('/upload/profile', protect, profileUpload.single('profilePicture'), uploadProfilePicture);

export default router;
