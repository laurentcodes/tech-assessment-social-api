# Social API

An api with Social Functionalities

## Requirements

- Node.js
- NPM
- Mongo DB Atlas/Compass
- Mailtrap
- Amazon S3

## Checks

Run the following commands to check if Node and NPM are installed on your computer and you should get the outputs similar to the ones in comments;

```npm
node -v // v14.5
npm -v // 6.14
```

If you get any errors refer to; <https://nodejs.org/en/download/>

## Get Started

- Create a MongoDB Cluster on MongoDB Atlas or using a local installation of MongoDB Atlas and save your `Connection String` somewhere.

- Create a Bucket on Amazon S3 and get the `Bucket Name` along with AWS Access Key and Secret Key and save it somewhere. Also set Bucket access to Public.

- Clone the Repository to your local environment.

```git
git clone https://github.com/laurentcodes/tech-assessment-social-api.git
```

- Install Dependencies

```npm
npm install
```

- Create a .env file and set environment variables as follows in your;

```env
NODE_ENV = development
PORT = 5000
MONGO_URI = <MONGODB CONNECTION STRING>
JWT_SECRET = <JWT SECRET>
CLIENT_URL = localhost://5000/api

AWS_ACCESS_KEY_ID=<YOUR AWS ACCESS KEY>
AWS_SECRET_ACCESS_KEY=<YOUR AWS SECRET KEY>
```

- Navigate to '/services/imageUpload.js' and set the AWS config as follows;

```js
aws.config.update({
 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
 accessKeyId: process.env.AWS_ACCESS_KEY_ID,
 region: 'us-east-2',
});
```

- In the File Upload code block, set the `bucket` property to the bucket name as created earlier

```js
const upload = multer({
 fileFilter,
 storage: multerS3({
  acl: 'public-read',
  s3,
  bucket: <BUCKET-NAME>,
  metadata: function (req, file, cb) {
   cb(null, { fieldName: 'TESTING_METADATA' });
  },
  key: function (req, file, cb) {
   cb(null, Date.now().toString());
  },
 }),
});
```

## Usage

```npm
npm run server
```

## Tests

To run available tests;

```npm
npm run test
```

## Postman Docs

Visit: <https://documenter.getpostman.com/view/8455510/TzeZDRGo>
