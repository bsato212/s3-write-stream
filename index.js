require('dotenv').config();
const fs = require('fs');
const AWS = require('aws-sdk');
const { pipeline } = require('stream');
const S3WriteStream = require('./s3-write-stream');

const bucket = process.env.BUCKET;

async function main() {
  const s3Client = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-east-1',
  });

  const reader = fs.createReadStream('test.txt');
  const getFileName = () => `test_${Date.now()}.txt`;
  const writer = new S3WriteStream({
    bucket,
    getFileName,
  }, s3Client);

  console.log('S3WriteStream');

  await new Promise((resolve, reject) => {
    pipeline(
      reader,
      writer,
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
          console.log('Pipeline Successful');
        }
      },
    );
  });

  console.log('Listing Bucket Objects');
  console.log(await s3Client.listObjectsV2({ Bucket: bucket }).promise());
}

main().catch((error) => console.error(error));
