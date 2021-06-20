import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';

import User from '../models/userModel.js';
import Post from '../models/postModel.js';
import Reply from '../models/replyModel.js';

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
	// const postExists = await Post.findOne({ title });

	// if (postExists) {
	// 	res.status(400).json({ error: 'Post exists already' });
	// }

	// Create post
	const post = await Post.create({ userId: user._id, title, body });

	if (post) {
		res.status(200).json({
			userId: user._id,
			postId: post._id,
			title: post.title,
			body: post.body,
		});
	}
});

// @desc    Fetch a post
// @route   GET /api/posts/:id
// @access  private
const fetchPost = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	const { id } = req.params;

	// If user doesn't exist
	if (!user) {
		res.status(400).json({ error: 'Invalid token or User not found' });
	}

	const post = await Post.findById(id);

	if (post) {
		res.status(200).json({
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
// @access  private
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

		res.status(200).json({ message: 'Post deleted Successfully' });
	} else {
		res.status(400).json({ error: 'Invalid Token or Unauthorized access' });
	}
});

// @desc    Edit a post
// @route   PUT /api/posts/:id
// @access  private
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
			.status(200)
			.json({ message: 'Post updated Successfully', post: updatedPost });
	} else {
		res.status(400).json({ error: 'Invalid Token or Unauthorized access' });
	}
});

// @desc    Reply to a post
// @route   PUT /api/posts/reply/:id
// @access  public
const replyPost = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { text } = req.body;

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

	// Create reply and save in database
	const reply = await Reply.create({
		post: id,
		text,
	});

	// Get post
	const post = await Post.findById(id);

	if (!post) {
		res.status(400).json({ error: 'Post not found' });
	}

	// Push the reply to the replies array on the post
	post.replies.push(reply);

	// Save changes
	await post.save();

	res.status(200).json({ message: 'Reply added Successfully', reply });
});

// @desc    Like a post
// @route   POST /api/posts/like/:id
// @access  private
const likePost = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	const { id } = req.params;

	if (!user) {
		res.status(400).json({ error: 'Invalid token or User not found' });
	}

	// Get post
	const post = await Post.findById(id);

	if (!post) {
		res.status(400).json({ error: 'Post not found' });
	}

	// Check if user has liked the post and if not
	// Add the user to the liked by array in the posts
	if (post.likedBy.includes(user._id)) {
		res.status(400).json({ error: 'Already liked by this user' });
	} else {
		post.likedBy.push(user._id);

		let likes = post.likedBy.length;

		await Post.findByIdAndUpdate(
			id,
			{ likes: likes },
			{ new: true, useFindAndModify: true }
		);

		// Save changes
		await post.save();
	}

	res.status(200).json('Post liked Successfully');
});

export { publishPost, fetchPost, deletePost, editPost, replyPost, likePost };
