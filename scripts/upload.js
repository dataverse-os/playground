/* eslint-disable @typescript-eslint/no-var-requires */
const awsSDK =  require('aws-sdk');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const mime = require("mime-types");


const spinner = ora("upload files...");

const log = console.log;

const options = {
  accessKeyId: 'AKIASMQXOV4J2PUONIV2',
  secretAccessKey: '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',
  bucket: "ownership-dataverse",
  dir: "web"
};

awsSDK.config.update({
  accessKeyId: options.accessKeyId,
  secretAccessKey: options.secretAccessKey
});
const s3 = new awsSDK.S3();


function readFiles(dir, paths = []) {
  const files = fs.readdirSync(dir);

  files.forEach(filename => {
    const fullPath = path.join(dir, filename);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      readFiles(path.join(dir, filename), paths);
    } else {
      paths.push(fullPath);
    }
  });
}

const paths= [];
readFiles(path.join(__dirname, "..", "dist"), paths);

const promises = [];
let load = 0;

paths.forEach(path => {
  const p = new Promise((resolve, reject) => {
    const params = {
      Bucket: options.bucket,
      Key: `${options.dir}/${path.split("/dist/")[1]}`,
      Body: fs.readFileSync(path),
      ACL: 'public-read',
      ContentType: mime.lookup(path)
    };
  
    s3.putObject(params, (err, res) => {
      if (err) {
        reject(err.message);
      } else {
        load++;
        spinner.stop();

        const size = fs.statSync(path).size;

        log(chalk.gray(`dist[${load}/${paths.length}]`), chalk.green(`${path.split("/dist/")[1]}`, chalk.gray(`- ${(size / 1000).toFixed(2)}kb`)))
        resolve();
      }
    });
  });

  promises.push(p);
});

spinner.start();
Promise.all(promises)
  .then(() => {
    spinner.stop();
    log(chalk.black.bgGreen(" DONE "), "Upload files successfully.");
    log(
      chalk.black.bgBlue(" PREVIEW "),
      chalk.blue(
        `https://${options.bucket}.s3.amazonaws.com/${options.dir}/index.html`
      )
    );
  })
  .catch((error) => {
    spinner.stop();
    log(chalk.red(error));

    process.exit(1);
  });



