import express from 'express';
import {
  listBoardings,
  getBoardingById,
  createBoarding,
  updateBoarding,
  deleteBoarding,
  listingImageUpload,
  uploadListingImages,
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listBoardings);
router.get('/:id', getBoardingById);

router.post('/upload-images', protect, listingImageUpload.array('images', 10), uploadListingImages);
router.post('/', protect, createBoarding);
router.put('/:id', protect, updateBoarding);
router.delete('/:id', protect, deleteBoarding);

export default router;
