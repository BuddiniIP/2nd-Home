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
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', listBoardings);
router.get('/my', protect, getMyBoardings);
router.get('/:id', getBoardingById);

router.post('/upload-images', protect, listingImageUpload.array('images', 10), uploadListingImages);
router.post('/', protect, createBoarding);
router.put('/:id', protect, updateBoarding);
router.delete('/:id', protect, deleteBoarding);
router.post('/:id/recount', protect, recountOccupants);

export default router;
