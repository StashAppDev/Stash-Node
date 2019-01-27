import AdmZip from "adm-zip";
import fse from "fs-extra";
import _glob from "glob";
import Jimp from "jimp";
import path from "path";
import { Gallery } from "../db/models/gallery.model";
import { FileUtils } from "../utils/file.utils";
import { Stash } from "./stash";

export class GalleryZip {

  public async getImage(gallery: Gallery, index: number) {
    const files = await gallery.getFiles();
    return files[index];
  }

  public async getThumbnail(gallery: Gallery, index: number) {
    const files = await gallery.getFiles();
    const file = files[index];
    const extName = path.extname(file);
    const baseName = path.basename(file, extName);
    const dirName = path.dirname(file);
    const thumbnailName = `${baseName}_thumb${extName}`;
    const thumbnailPath = path.join(dirName, thumbnailName);
    const thumbnailExists = await FileUtils.fileExists(thumbnailPath);
    if (thumbnailExists) { return thumbnailPath; }

    const originalImage = await Jimp.read(file);
    await originalImage.scaleToFit(512, 512).quality(90).writeAsync(thumbnailPath);
    return thumbnailPath;
  }

  public async getFiles(gallery: Gallery) {
    const galleryExtractedPath = Stash.paths.gallery.getExtractedPath(gallery.checksum);
    const extractedFilePaths = await this.getExtractedFilePaths(galleryExtractedPath);
    if (extractedFilePaths.length > 0) {
      return this.sorted(extractedFilePaths);
    } else {
      await this.extract(gallery, galleryExtractedPath);
      const newlyExtractedFilePaths = await this.getExtractedFilePaths(galleryExtractedPath);
      return this.sorted(newlyExtractedFilePaths);
    }
  }

  private async extract(gallery: Gallery, galleryExtractedPath: string) {
    await fse.ensureDir(galleryExtractedPath);
    const zip = new AdmZip(gallery.path);
    await this.extractAll(zip, galleryExtractedPath);
  }

  private sorted(entries: string[]) {
    return entries.sort((a, b) => {
      if (a > b) { return 1; }
      if (a < b) { return -1; }
      return 0;
    });
  }
  // TODO
// def self.sorted(zip_file)
// files = zip_file.glob('**.jpg', File::FNM_CASEFOLD) + zip_file.glob('**.png', File::FNM_CASEFOLD) + zip_file.glob('**.gif', File::FNM_CASEFOLD)
// files = files.delete_if { |file| file.name.include? "__MACOSX" }
// return Naturally.sort_by(files, :name)
// end

  private async getExtractedFilePaths(galleryExtractedPath: string) {
    return await FileUtils.glob(`${galleryExtractedPath}/**/!(*_thumb).*`, { realpath: true });
  }

  private extractAll(zip: AdmZip, targetPath: string) {
    return new Promise((resolve, reject) => {
      zip.extractAllToAsync(targetPath, false, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
