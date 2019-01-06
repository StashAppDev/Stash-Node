import childProcess from "child_process";
import crypto from "crypto";
import fs from "fs";
import tempy from "tempy";

export function md5FromPath(filePath: string) {
  const bufferSize = 8192;
  const fd = fs.openSync(filePath, "r");
  const hash = crypto.createHash("md5");
  const buffer = Buffer.alloc(bufferSize);

  try {
    let bytesRead = 0;

    do {
      bytesRead = fs.readSync(fd, buffer, 0, bufferSize, null);
      hash.update(buffer.slice(0, bytesRead));
    } while (bytesRead === bufferSize);
  } finally {
    fs.closeSync(fd);
  }

  return hash.digest("hex");
}
/**
 * Helper used by the controllers which transforms the given image base64 string into a binary image and then
 * assigns the correct values to the given object.
 *
 * @param params The parameters given from the GraphQL request.  The image string is the only thing of interest.
 * @param object The model object.  Checksum will be assigned the MD5 hash of the image, while image will be assigned
 * the blob of data.
 * @todo This doesn't handle strings which start with a data uri scheme like `data:image/jpeg;base64`.  That part
 * needs to be striped.
 * @see /app/graphql/concerns/image_processor.rb
 */
export function processImage(params: { image?: string }, object: { checksum?: string, image?: Buffer }) {
  if (!params.image) { return; }

  const image = Buffer.from(params.image, "base64");

  const tempFile = tempy.file({extension: "jpg"});
  fs.writeFileSync(tempFile, image, "binary");

  object.checksum = md5FromPath(tempFile);
  object.image = image;
}

// https://noraesae.net/2017/11/16/useful-utility-functions-in-typescript/
export function exec(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}

export function execFile(file: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    childProcess.execFile(file, args, (err, stdout, stderror) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout);
      }
    });
  });
}
