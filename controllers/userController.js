import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import sendMail from '../utils/sendMail.js';

import User from '../models/userModel.js';
import Token from '../models/tokenModel.js';

// @desc    Register a new user
// @route   POST /api/users/
// @access  public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const errors = validationResult(req);

	// Check for errors and return if any
	if (!errors.isEmpty()) {
		errors.array().forEach((item) => {
			res.status(400).json({
				value: item.value,
				message: item.msg,
			});
		});
	}

	// Check if user exists in db
	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400).json({ error: 'User exists already' });
	}

	// Create and save user to db
	const user = await User.create({
		name,
		email,
		password,
	});

	// Check if user created successfully
	if (user) {
		res.status(201).json({
			userId: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});

		// Send Email to User
		try {
			sendMail(user, 'Welcome to the Platform!', 'welcome');
		} catch (err) {
			res.status(404).json({ err });
		}
	} else {
		res.status(400).json({ error: 'Invalid User data' });
	}
});

// @desc    Login/Authenticate the user & get token
// @route   POST /api/users/login
// @access  public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const errors = validationResult(req);

	// Check for errors and return if any
	if (!errors.isEmpty()) {
		errors.array().forEach((item) => {
			res.status(400).json({
				value: item.value,
				message: item.msg,
			});
		});
	}

	const user = await User.findOne({ email });

	// If user exists and password matches
	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(401).json({ error: 'Invalid email or password' });
	}
});

// @desc    Reset user password mail sending
// @route   POST /api/users/reset
// @access  public
const resetPasswordMail = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const errors = validationResult(req);

	// Check for errors and return if any
	if (!errors.isEmpty()) {
		errors.array().forEach((item) => {
			res.status(400).json({
				value: item.value,
				message: item.msg,
			});
		});
	}

	// Check for user in database
	const user = await User.findOne({ email });

	if (!user) {
		res.status(400).json({ error: 'User does not exist' });
	}

	// Check if token exists
	let token = await Token.findOne({ userId: user._id });

	if (token) {
		await token.deleteOne();
	}

	// Generate new token to be sent to user
	let resetToken = crypto.randomBytes(32).toString('hex');
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(resetToken, salt);

	// Add new token to database
	const tokenStr = await Token.create({
		userId: user._id,
		token: hash.replace(/\//g, 's'),
	});

	let clientURL = process.env.CLIENT_URL;

	// Reset link to be sent to user
	const link = `${clientURL}/users/reset/${tokenStr.token}/${user._id}`;

	// Send the mail to user
	sendMail(user, 'Password Reset', 'reset', link);

	res.status(201).json(`Password reset link sent: ${link}`);
});

// @desc    Reset user password mail
// @route   POST /api/users/reset/:token/:userId
// @access  public
const resetPassword = asyncHandler(async (req, res) => {
	const { token, userId } = req.params;
	const { password } = req.body;

	const errors = validationResult(req);

	// Check for errors and return if any
	if (!errors.isEmpty()) {
		errors.array().forEach((item) => {
			res.status(400).json({
				value: item.value,
				message: item.msg,
			});
		});
	}

	const user = await User.findById(userId);

	if (!user) {
		res.status(400).json('Invalid link or link expired');
	}

	// Check for token in the database
	const tokenDB = await Token.findOne({
		userId: user._id,
		token: token,
	});

	if (!tokenDB) {
		res.status(400).json('Invalid link or link expired');
	}

	// Update user password to the new password and save changes to db
	user.password = password;
	await user.save();

	// If no validation errors
	if (errors.isEmpty()) {
		// Delete token from database
		await tokenDB.delete();
	}

	res.status(201).json('Password reset Successfully');
});

export { registerUser, loginUser, resetPasswordMail, resetPassword };
