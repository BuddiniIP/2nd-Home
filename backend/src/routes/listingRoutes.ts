import express from 'express';
import {
  listBoardings,
  getBoardingById,
  getMyBoardings,
  createBoarding,
  updateBoarding,
  deleteBoarding,
  recountOccupants,
  listingImageUpload,
  uploadListingImages,
  getBoardingCount,
} from '../controllers/listingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { UserRole } from '../models/User.js';

const router = express.Router();

router.get('/', listBoardings);
router.get('/count', getBoardingCount);
router.get('/my', protect, authorize(UserRole.OWNER), getMyBoardings);
router.get('/:id', getBoardingById);

router.post('/upload-images', protect, authorize(UserRole.OWNER), listingImageUpload.array('images', 10), uploadListingImages);
router.post('/', protect, authorize(UserRole.OWNER), createBoarding);
router.put('/:id', protect, authorize(UserRole.OWNER), updateBoarding);
router.delete('/:id', protect, authorize(UserRole.OWNER, UserRole.ADMIN), deleteBoarding);
router.post('/:id/recount', protect, authorize(UserRole.OWNER), recountOccupants);

export default router;
