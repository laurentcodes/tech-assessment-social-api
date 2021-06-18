import mongoose from 'mongoose';

const imageSchema = mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		url: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Image = mongoose.model('Image', imageSchema);

export default Image;
