import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
	{
		post: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Post',
		},
		text: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Reply = mongoose.model('Reply', postSchema);

export default Reply;
