import express from 'express';
const router = express.Router();

import { auth } from '../middleware/authMiddleware.js';

import { uploadImage } from '../controllers/imageController.js';

// Upload a new image
router.post('/', auth, uploadImage);

export default router;
