require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

const AWS_S3_MEAN_BUCKET = process.env.AWS_S3_MEAN_BUCKET;
const AWS_S3_REGION = process.env.AWS_S3_REGION;
const AWS_S3_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID;
const AWS_S3_SECRECT_ACCESS_KEY = process.env.AWS_S3_SECRECT_ACCESS_KEY;

const s3 = new S3({
  region: AWS_S3_REGION,
  accessKeyId: AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: AWS_S3_SECRECT_ACCESS_KEY,
});

function uploadToS3(file, bucket_location) {
  const file_stream = fs.createReadStream(file.path);

  const s3_location = AWS_S3_MEAN_BUCKET + "/" + bucket_location;
  console.log(s3_location);

  const uploadParams = {
    Bucket: s3_location,
    Body: file_stream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}
exports.uploadToS3 = uploadToS3;

function downloadFromS3(bucket, filepath) {
  const options = {
    Bucket: bucket,
    Key: filepath,
  };
  // console.log(options);
  var fileStream = s3.getObject(options).createReadStream();
  return fileStream;
}

exports.downloadFromS3 = downloadFromS3;

function deleteObjectS3(bucket, filepath) {
  const options = {
    Bucket: bucket,
    Key: filepath,
  };
  s3.deleteObject(options, (error, data) => {
    if (error) return false;
    else return true;
  });
}

exports.deleteObjectS3 = deleteObjectS3;

async function emptyS3Directory(bucket, dir) {
  const listParams = {
    Bucket: bucket,
    Prefix: dir,
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] },
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

exports.emptyS3Directory = emptyS3Directory;
