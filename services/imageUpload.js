import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const s3 = new aws.S3();

// AWS Configuration
aws.config.update({
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	region: 'us-east-2',
});

// Check if files match type jpeg or png
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(Error('Invalid File Type, only JPEG and PNG allowed!'), false);
	}
};

// File Upload
const upload = multer({
	fileFilter,
	storage: multerS3({
		acl: 'public-read',
		s3,
		bucket: 'social-assesment',
		metadata: function (req, file, cb) {
			cb(null, { fieldName: 'TESTING_METADATA' });
		},
		key: function (req, file, cb) {
			cb(null, Date.now().toString());
		},
	}),
});

export default upload;
