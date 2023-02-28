var path = require('path');
var fs = require('fs');
var mime = require('mime');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('scripts/s3-deploy/config.json');
let s3 = new AWS.S3();

const uploadDir = function (s3Path, bucketName) {
  function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
      var filePath = path.join(currentDirPath, name);
      var stat = fs.statSync(filePath);
      if (stat.isFile()) {
        callback(filePath, stat);
      } else if (stat.isDirectory()) {
        walkSync(filePath, callback);
      }
    });
  }

  walkSync(s3Path, function (filePath, stat) {
    let bucketPath = filePath.substring(s3Path.length + 1);
    let mimeType = mime.getType(bucketPath);
    let params = {
      Bucket: bucketName,
      Key: bucketPath.replace(/\\/g, '/'),
      Body: fs.readFileSync(filePath),
      ContentType: mimeType,
    };
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully uploaded ' + bucketPath + ' to ' + bucketName);
      }
    });
  });
};

uploadDir('dist', '101.gold');
