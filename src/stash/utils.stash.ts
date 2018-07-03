import childProcess from "child_process";
import crypto from "crypto";
import fs from "fs";

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
