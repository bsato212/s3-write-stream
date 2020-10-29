const { Writable, PassThrough } = require('stream');

class S3WriteStream extends Writable {
  constructor(settings, s3Client) {
    super();

    this.settings = settings;
    this.s3Client = s3Client;
    this.writeStream = new PassThrough();

    this.uploader = s3Client.upload({
      Bucket: this.settings.bucket,
      Key: this.settings.getFileName(),
      Body: this.writeStream,
    }).promise();
  }

  _final(callback) {
    console.log('Final');

    this.writeStream.push(null);

    this.uploader.then((result) => {
      console.log('Uploader Callback');
      console.log(result);
      callback();
    })
  }

  _write(chunk, encoding, callback) {
    this.writeStream.push(chunk, encoding);
    callback();
  }
}

module.exports = S3WriteStream;
