import asyncHandler from 'express-async-handler';
import upload from '../services/imageUpload.js';

import Image from '../models/imageModel.js';
import User from '../models/userModel.js';

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

	// Upload Image
	singleUpload(req, res, async (err) => {
		// If any errors
		if (err) {
			res.status(401).json({ title: 'Image Upload Error', error: err.message });
		}

		// Save link of image
		let imageLink = { image: req.file.location };

		// Add image to Database
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
