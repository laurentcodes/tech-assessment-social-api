import express from 'express';
import { body } from 'express-validator';
const router = express.Router();

import { auth } from '../middleware/authMiddleware.js';

import {
	publishPost,
	fetchPost,
	deletePost,
	editPost,
	replyPost,
} from '../controllers/postController.js';

// Publish a new post
router.post(
	'/',
	auth,
	body('title').notEmpty().withMessage('Title can not be empty'),
	body('body').notEmpty().withMessage('Body can not be empty'),
	publishPost
);

// Fetch an existing post
router.get('/:id', auth, fetchPost);

// Delete an existing post
router.delete('/delete/:id', auth, deletePost);

// Edit a post
router.put('/edit/:id', auth, editPost);

// Reply to a post
router.post(
	'/reply/:id',
	auth,
	body('text').notEmpty().withMessage('Reply can not be empty'),
	replyPost
);

export default router;
