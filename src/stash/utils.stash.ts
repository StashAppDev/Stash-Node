import fs from "fs";
import tempy from "tempy";
import { CryptoUtils } from "../utils/crypto.utils";
import { IJsonObject } from "./json.stash";
import { StashManager } from "./manager.stash";

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
export async function processImage(params: { image?: string }, object: { checksum?: string, image?: Buffer }) {
  if (!params.image) { return; }

  const image = Buffer.from(params.image, "base64");

  const tempFile = tempy.file({extension: "jpg"});
  fs.writeFileSync(tempFile, image, "binary");

  object.checksum = await CryptoUtils.md5FromPath(tempFile);
  object.image = image;
}

export function parseJsonFile(filePath: string) {
  try {
    const jsonFile = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(jsonFile);
    return json;
  } catch (e) {
    StashManager.warn(`Failed to parse json file ${filePath}! Error: ${e}`);
  }
}

export function writeJsonFile(filePath: string, json: IJsonObject) {
  try {
    const jsonString = JSON.stringify(json, undefined, 2);
    fs.writeFileSync(filePath, jsonString, "utf8");
  } catch (e) {
    StashManager.warn(`Failed to write json file ${filePath}! Error: ${e}`);
  }
}
