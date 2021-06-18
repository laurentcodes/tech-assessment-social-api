import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import upload from '../services/imageUpload.js';

import Image from '../models/imageModel.js';
import User from '../models/userModel.js';
import Post from '../models/postModel.js';

const singleUpload = upload.single('image');

// @desc    Upload an image
// @route   POST /api/images/
// @access  public
const uploadImage = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	// If user doesn't exist
	if (!user) {
		res.status(400).json({ error: 'Invalid token or User not found' });
	}

	singleUpload(req, res, async (err) => {
		if (err) {
			res.status(401).json({ title: 'Image Upload Error', error: err.message });
		}

		let imageLink = { image: req.file.location };

		Image.create({ userId: user._id, url: imageLink.image })
			.then((image) =>
				res
					.status(200)
					.json({ message: 'Image Uploaded Successfully', link: image.url })
			)
			.catch((err) => res.status(400).json({ error: err }));
	});
});

export { uploadImage };
