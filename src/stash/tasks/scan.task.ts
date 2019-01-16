import fse from "fs-extra";
import { Model } from "objection";
import path from "path";
import { Gallery } from "../../db/models/gallery.model";
import { Scene } from "../../db/models/scene.model";
import { CryptoUtils } from "../../utils/crypto.utils";
import { FFMpeg, IScreenshotOptions } from "../ffmpeg/ffmpeg";
import { VideoFile } from "../ffmpeg/video-file";
import { BaseTask } from "./base.task";

export class ScanTask extends BaseTask {
  private filePath: string;
  private videoFile?: VideoFile;

  constructor(filePath: string) {
    super();
    this.filePath = filePath;
  }

  public async start() {
    if (this.getClass() === Scene) {
      this.videoFile = await VideoFile.create(this.filePath);
    }
    this.manager.verbose(this.filePath);
    this.createFolders();
    const klass = this.getClass() as typeof Model;

    let entity = await klass.query().findOne({ path: this.filePath });
    if (!!entity) { return; } // We already have this item in the database, keep going

    const checksum = await this.calculateChecksum();

    await this.makeScreenshots(checksum);

    entity = await klass.query().findOne({ checksum });
    if (!!entity) {
      this.manager.info(`${this.filePath} already exists.  Updating path...`);
      await (entity as any).$query().update({ path: this.filePath });
    } else {
      this.manager.info(`${this.filePath} doesn't exist.  Creating new item...`);

      if (!!this.videoFile) {
        await Scene.query().insert({
          checksum,
          path: this.filePath,
          size: this.videoFile.size!.toString(),
          duration: this.videoFile.duration,
          video_codec: this.videoFile.videoCodec,
          audio_codec: this.videoFile.audioCodec,
          width: this.videoFile.width,
          height: this.videoFile.height,
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

    await this.makeScreenshot(thumbPath, 5, 320);
    await this.makeScreenshot(normalPath, 2, this.videoFile!.width!);
  }

  private async makeScreenshot(outputPath: string, quality: number, width: number) {
    if (!this.videoFile) { return; }
    const ffmpeg = new FFMpeg(this.videoFile);
    const duration = this.videoFile.duration || 0;
    const options: IScreenshotOptions = {
      outputPath,
      quality,
      time: duration * 0.2,
      width,
    };
    await ffmpeg.screenshot(options);
  }

  private async calculateChecksum() {
    this.manager.info(`${this.filePath} not found.  Calculating checksum...`);
    const checksum = await CryptoUtils.md5FromPath(this.filePath);
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
