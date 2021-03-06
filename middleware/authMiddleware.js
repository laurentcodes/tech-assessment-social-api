import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const auth = asyncHandler(async (req, res, next) => {
	let token;

	// Check request header for Authentication Bearer Token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			// Get token from header
			token = req.headers.authorization.split(' ')[1];

			// Decode token and check if user exists with id in token
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = await User.findById(decoded.id).select('-password');

			next();
		} catch (err) {
			console.error(err);
			res.status(401).json({ error: 'Not authorized, token failed' });
		}
	}

	if (!token) {
		res.status(401).json({ error: 'Not authorized, no token' });
	}
});

export { auth };
