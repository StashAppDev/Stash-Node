import fse from "fs-extra";
import path from "path";
import { Database } from "../../db/database";
import { FFMpeg } from "../ffmpeg.stash";
import { FFProbe } from "../ffprobe.stash";
import { md5FromPath } from "../utils.stash";
import { BaseTask } from "./base.task";

export class ScanTask extends BaseTask {
  private filePath: string;
  private movie?: FFProbe;

  constructor(filePath: string) {
    super();
    this.filePath = filePath;
    if (this.getClass() === Database.Scene) {
      this.movie = new FFProbe(this.filePath);
    }
  }

  public async start() {
    this.manager.verbose(this.filePath);
    this.createFolders();
    const klass = this.getClass();

    let entity;
    if (klass === Database.Scene) {
      entity = await klass.findOne({where: {path: this.filePath}});
    } else if (klass === Database.Gallery) {
      entity = await klass.findOne({where: {path: this.filePath}});
    }
    if (!!entity) { return; } // We already have this item in the database, keep going

    const checksum = this.calculateChecksum();

    await this.makeScreenshots(checksum);

    if (klass === Database.Scene) {
      entity = await klass.findOne({where: { checksum }});
    } else if (klass === Database.Gallery) {
      entity = await klass.findOne({where: { checksum }});
    }
    if (!!entity) {
      this.manager.info(`${this.filePath} already exists.  Updating path...`);
      entity.path = this.filePath;
      await entity.save();
    } else {
      this.manager.info(`${this.filePath} doesn't exist.  Creating new item...`);

      if (klass === Database.Scene) {
        entity = await klass.build({ checksum, path: this.filePath });
        entity.size        = this.movie!.size.toString();
        entity.duration    = this.movie!.duration;
        entity.videoCodec  = this.movie!.videoCodec;
        entity.audioCodec  = this.movie!.audioCodec;
        entity.width       = this.movie!.width;
        entity.height      = this.movie!.height;
        await entity.save();
      } else if (klass === Database.Gallery) {
        entity = await klass.build({ checksum, path: this.filePath });
        await entity.save();
      }
    }
  }

  private async makeScreenshots(checksum: string) {
    if (this.getClass() !== Database.Scene) { return; }

    const thumbPath = this.paths.thumbnailScreenshotPath(checksum);
    const normalPath = this.paths.screenshotPath(checksum);

    if (fse.existsSync(thumbPath) && fse.existsSync(normalPath)) {
      this.manager.verbose("Screenshots already exist for this path... skipping");
      return;
    }

    await this.makeScreenshot(this.movie!, thumbPath, 5, 320);
    await this.makeScreenshot(this.movie!, normalPath, 2, this.movie!.width);
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
      return Database.Gallery;
    } else {
      return Database.Scene;
    }
  }

  private createFolders() {
    const tmpPath = path.join(this.paths.screenshots, "tmp");
    fse.ensureDirSync(tmpPath);
  }
}
