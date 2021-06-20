import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
		likes: {
			type: Number,
			default: 0,
		},
		likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model('Post', postSchema);

export default Post;
