import express from 'express';
import { body } from 'express-validator';
const router = express.Router();

import {
	registerUser,
	loginUser,
	resetPasswordMail,
	resetPassword,
} from '../controllers/userController.js';

// import { protect } from '../middleware/authMiddleware.js';

// router.get('/', (req, res) => {
// 	res.send('User route working');
// });

// Register User Route
router.post(
	'/',
	body('name').not().isEmpty().withMessage('Name cannot be empty'),
	body('email').isEmail().withMessage('Invalid Email Provided'),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be 6 characters or more'),
	registerUser
);

// Login User Route
router.post(
	'/login',
	body('email').isEmail().withMessage('Invalid Email Provided'),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be 6 characters or more'),
	loginUser
);

// Reset User Password Mail Sending Route
router.post(
	'/reset',
	body('email').isEmail().withMessage('Invalid Email Provided'),
	resetPasswordMail
);

// Reset Password Route
router.post(
	'/reset/:token/:userId',
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be 6 characters or more'),
	resetPassword
);

// router
// 	.route('/profile')
// 	.get(protect, getUserProfile)
// 	.put(protect, updateUserProfile);

export default router;
