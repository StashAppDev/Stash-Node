import crypto from "crypto";
import fse from "fs-extra";

export class CryptoUtils {
  public static async md5FromPath(filePath: string) {
    const bufferSize = 8192;
    const fd = await fse.open(filePath, "r");
    const hash = crypto.createHash("md5");
    const buffer = Buffer.alloc(bufferSize);

    try {
      let bytesRead = 0;

      do {
        bytesRead = (await fse.read(fd, buffer, 0, bufferSize, null)).bytesRead;
        hash.update(buffer.slice(0, bytesRead));
      } while (bytesRead === bufferSize);
    } finally {
      await fse.close(fd);
    }

    return hash.digest("hex");
  }
}
