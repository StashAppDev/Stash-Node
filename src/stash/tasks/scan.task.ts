import fse from "fs-extra";
import path from "path";
import { Scene } from "../../models/scene.model";
import { FFMpeg } from "../ffmpeg.stash";
import { FFProbe } from "../ffprobe.stash";
import { md5FromPath } from "../utils.stash";
import { BaseTask } from "./base.task";

export class ScanTask extends BaseTask {
  private filePath: string;

  constructor(filePath: string) {
    super();
    this.filePath = filePath;
  }

  public async start() {
    this.createFolders();
    const klass = this.getClass();

    const movie = new FFProbe(this.filePath);

    let entity = await klass.findOne({where: {path: this.filePath}});
    if (!!entity) {
      await this.makeScreenshots(movie, entity.checksum);
      return; // We already have this item in the database, keep going
    }

    const checksum = this.calculateChecksum();

    await this.makeScreenshots(movie, checksum);

    entity = await klass.findOne({where: {checksum}});
    if (!!entity) {
      this.manager.info(`${this.filePath} already exists.  Updating path...`);
      entity.path = this.filePath;
      entity.save();
    } else {
      this.manager.info(`${this.filePath} doesn't exist.  Creating new item...`);
      entity = await klass.build({
        checksum,
        path: this.filePath,
      });

      if (klass === Scene) {
        entity.size        = movie.size.toString();
        entity.duration    = movie.duration;
        entity.videoCodec  = movie.videoCodec;
        entity.audioCodec  = movie.audioCodec;
        entity.width       = movie.width;
        entity.height      = movie.height;
      }

      await entity.save();
    }
  }

  private async makeScreenshots(movie: FFProbe, checksum: string) {
    if (this.getClass() !== Scene) {
      this.manager.verbose(`Trying to make screenshots for ${this.getClass()}.  Skipping...`);
      return;
    }

    const thumbPath = this.paths.thumbnailScreenshotPath(checksum);
    const normalPath = this.paths.screenshotPath(checksum);

    if (fse.existsSync(thumbPath) && fse.existsSync(normalPath)) {
      this.manager.verbose("Screenshots already exist for this path... skipping");
      return;
    }

    await this.makeScreenshot(movie, thumbPath, 5, 320);
    await this.makeScreenshot(movie, normalPath, 2, movie.width);
  }

  private async makeScreenshot(movie: FFProbe, outputPath: string, quality: number, width: number) {
    const ffmpeg = new FFMpeg(movie.path);
    await ffmpeg.screenshot(movie, outputPath, quality, width);
  }

  private calculateChecksum() {
    this.manager.info(`${this.filePath} not found.  Calculating checksum...`);
    const checksum = md5FromPath(this.filePath);
    this.manager.debug(`Checksum calculated: ${checksum}`);
    return checksum;
  }

  private getClass() {
    if (path.extname(this.filePath) === ".zip") {
      // TODO Gallery
      throw new Error(`TODO Gallery ${this.filePath}`);
    } else {
      return Scene;
    }
  }

  private createFolders() {
    const tmpPath = path.join(this.paths.screenshots, "tmp");
    fse.ensureDirSync(tmpPath);
  }
}
