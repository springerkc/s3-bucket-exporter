require('dotenv').config();
const fs = require('fs');

const { S3Client, ListObjectsCommand } = require('@aws-sdk/client-s3');

(async () => {
	const client = new S3Client({
		region: process.env.AWS_REGION,
		credentials: { accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SEC },
	});
	const command = new ListObjectsCommand({ Bucket: process.env.AWS_BUCKET, MaxKeys: "4000" });
	const response = await client.send(command);
	
	fs.writeFileSync(`./_results/${process.env.AWS_BUCKET.toLowerCase()}_${Date.now()}_objectList.json`, JSON.stringify(response, null ,2));
})()
