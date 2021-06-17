import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';

import User from '../models/userModel.js';
import Post from '../models/postModel.js';

// @desc    Publish a new post
// @route   POST /api/posts/
// @access  public
const publishPost = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	const { title, body } = req.body;

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

	// If user doesn't exist
	if (!user) {
		res.status(400).json({ error: 'Invalid token or User not found' });
	}

	// Check if post already exists
	const postExists = await Post.findOne({ title });

	if (postExists) {
		res.status(400).json({ error: 'Post exists already' });
	}

	// Create post
	const post = await Post.create({ userId: user._id, title, body });

	if (post) {
		res.status(201).json({
			userId: user._id,
			postId: post._id,
			title: post.title,
			body: post.body,
		});
	}
});

// @desc    Fetch a post
// @route   GET /api/posts/:id
// @access  public
const fetchPost = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	const { id } = req.params;

	// If user doesn't exist
	if (!user) {
		res.status(400).json({ error: 'Invalid token or User not found' });
	}

	const post = await Post.findById(id);

	if (post) {
		res.status(201).json({
			title: post.title,
			body: post.body,
			userId: post.userId,
			replies: post.replies,
		});
	} else {
		res.status(404).json({ error: 'Post not found' });
	}
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  public
const deletePost = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	const { id } = req.params;

	// If user doesn't exist
	if (!user) {
		res.status(400).json({ error: 'Invalid token or User not found' });
	}

	const post = await Post.findById(id);

	if (!post) {
		res.status(400).json({ error: 'Post not found' });
	}

	// Check if it's the user who created the post that's trying to delete it
	if (user._id.toString() === post.userId.toString()) {
		await Post.deleteOne({ _id: id });

		res.status(201).json({ message: 'Post deleted Successfully' });
	} else {
		res.status(400).json({ error: 'Invalid Token or Unauthorized access' });
	}
});

// @desc    Edit a post
// @route   PUT /api/post/
// @access  public
const editPost = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	const { title, body } = req.body;
	const { id } = req.params;

	if (!user) {
		res.status(400).json({ error: 'Invalid token or User not found' });
	}

	const post = await Post.findById(id);

	if (!post) {
		res.status(400).json({ error: 'Post not found' });
	}

	// Check if it's the user who created the post that's trying to edit it
	if (user._id.toString() === post.userId.toString()) {
		const postUpdate = {};

		// Check for values in request body
		if (title) postUpdate.title = title;
		if (body) postUpdate.title = body;

		const updatedPost = await Post.findByIdAndUpdate(
			id,
			{ $set: postUpdate },
			{ new: true, useFindAndModify: true }
		);

		res
			.status(201)
			.json({ message: 'Post updated Successfully', post: updatedPost });
	} else {
		res.status(400).json({ error: 'Invalid Token or Unauthorized access' });
	}
});

export { publishPost, fetchPost, deletePost, editPost };
