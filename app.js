require('dotenv').config();
const fs = require('fs');

const { S3Client, ListObjectsCommand } = require('@aws-sdk/client-s3');

const printPage = async (marker, page) => {
	let ending = false;
	const opts = { Bucket: process.env.AWS_BUCKET, MaxKeys: "1000", Marker: marker };

	if (marker !== '') opts.Marker = marker;

	const client = new S3Client({
		region: process.env.AWS_REGION,
		credentials: { accessKeyId: process.env.AWS_KEY, secretAccessKey: process.env.AWS_SEC },
	});
	const command = new ListObjectsCommand(opts);
	const response = await client.send(command);

	if (response.Contents && response.Contents.length >= 1) {
		fs.writeFileSync(`./_results/${process.env.AWS_BUCKET.toLowerCase()}_objectList_page_${page}__${Date.now()}.json`, JSON.stringify(response, null ,2));
	}

	if (!response.Contents) ending = true;
	

	return { data: response.Contents || {}, isEnd: ending };
};

(async () => {
	let page = 1;
	let marker = '';
	let totalObjects = 0;

	while (marker !== undefined) {
		const ress = await printPage(marker, page);

		if (!ress.isEnd && ress.data && ress.data.length >= 1) {
			marker = ress.data[ress.data.length - 1].Key || undefined;
			totalObjects += ress.data.length
			page++;
		}

		if (ress.isEnd) marker = undefined;
	}

	console.log(`✅ Your S3 bucket had ${totalObjects} objects printed to ${--page} page's in your _results folder. \nNice work 🎉`);
	console.log('Thanks for using the S3 Bucket Exporter 🙏🧑‍💻⭐️');
})();
