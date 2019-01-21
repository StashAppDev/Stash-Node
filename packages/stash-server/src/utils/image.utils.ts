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
   * @see /app/graphql/concerns/image_processor.rb
   */
  public static async processBase64Image(params: { image?: string }, object: { checksum?: string, image?: Buffer }) {
    if (!params.image) { return; }

    const regex = /^data:.+\/(.+);base64,(.*)$/;
    const matches = params.image.match(regex);
    if (!matches) { throw new Error("Failed to process base64 image"); }
    const image = Buffer.from(matches[2], "base64");

    const tempFile = tempy.file({extension: "jpg"});
    fs.writeFileSync(tempFile, image, "binary");

    object.checksum = await CryptoUtils.md5FromPath(tempFile);
    object.image = image;
  }
}
