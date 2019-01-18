import fs from "fs";
import tempy from "tempy";
import { CryptoUtils } from "./crypto.utils";

export class ImageUtils {
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
  public static async processBase64Image(params: { image?: string }, object: { checksum?: string, image?: Buffer }) {
    if (!params.image) { return; }

    const image = Buffer.from(params.image, "base64");

    const tempFile = tempy.file({extension: "jpg"});
    fs.writeFileSync(tempFile, image, "binary");

    object.checksum = await CryptoUtils.md5FromPath(tempFile);
    object.image = image;
  }
}
