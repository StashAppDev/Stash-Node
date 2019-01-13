import fse from "fs-extra";
import { Model } from "objection";
import path from "path";
import { Gallery } from "../../db/models/gallery.model";
import { Scene } from "../../db/models/scene.model";
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
    if (this.getClass() === Scene) {
      this.movie = new FFProbe(this.filePath);
    }
  }

  public async start() {
    this.manager.verbose(this.filePath);
    this.createFolders();
    const klass = this.getClass() as typeof Model;

    let entity = await klass.query().findOne({ path: this.filePath });
    if (!!entity) { return; } // We already have this item in the database, keep going

    const checksum = this.calculateChecksum();

    await this.makeScreenshots(checksum);

    entity = await klass.query().findOne({ checksum });
    if (!!entity) {
      this.manager.info(`${this.filePath} already exists.  Updating path...`);
      await (entity as any).$query().update({ path: this.filePath });
    } else {
      this.manager.info(`${this.filePath} doesn't exist.  Creating new item...`);

      if (klass === Scene) {
        await Scene.query().insert({
          checksum,
          path: this.filePath,
          size: this.movie!.size.toString(),
          duration: this.movie!.duration,
          video_codec: this.movie!.videoCodec,
          audio_codec: this.movie!.audioCodec,
          width: this.movie!.width,
          height: this.movie!.height,
        });
      } else if (klass === Gallery) {
        await Gallery.query().insert({ checksum, path: this.filePath });
      }
    }
  }

  private async makeScreenshots(checksum: string) {
    if (this.getClass() !== Scene) { return; }

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
      return Gallery;
    } else {
      return Scene;
    }
  }

  private createFolders() {
    const tmpPath = path.join(this.paths.screenshots, "tmp");
    fse.ensureDirSync(tmpPath);
  }
}
