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
			unique: true,
		},
		replies: [{ type: String, required: false }],
		// likes: {
		//   type: Number,
		// }
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model('Post', postSchema);

export default Post;
