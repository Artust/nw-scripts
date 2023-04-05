const { S3Client } = require('@aws-sdk/client-s3');

const { ENV } = process.env;

const s3 = new S3Client(ENV === 'prod' ? 'us-east-1' : 'ap-southeast-1');

/**
 * Upload data to s3
 * @param {*} object data
 * @param {string} filename name of file
 * @returns boolean
 */
exports.uploadJsonToS3 = (object, filename) => {
  const data = {
    Bucket: 'garsche-dev/events',
    Key: filename,
    Body: JSON.stringify(object),
    ContentType: 'application/json',
  };
  return new Promise((resolve, reject) => {
    s3.putObject(data, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};
