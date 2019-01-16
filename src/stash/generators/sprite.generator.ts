import Jimp from "jimp";
import { log } from "../../logger";
import { FileUtils } from "../../utils/file.utils";
import { VttUtils } from "../../utils/vtt.utils";
import { FFMpeg, IScreenshotOptions } from "../ffmpeg/ffmpeg";
import { VideoFile } from "../ffmpeg/video-file";
import { StashPaths } from "../paths.stash";
import { BaseGenerator } from "./base.generator";

export class SpriteGenerator extends BaseGenerator {
  private spriteImageOutputPath: string;
  private spriteVttOutputPath: string;
  private rows: number = 9;
  private cols: number = 9;
  private thumbWidth: number = 160;

  constructor(videoFile: VideoFile, spriteImageOutputPath: string, spriteVttOutputPath: string) {
    super(videoFile);
    this.chunkCount = this.rows * this.cols;
    this.spriteImageOutputPath = spriteImageOutputPath;
    this.spriteVttOutputPath = spriteVttOutputPath;
  }

  public async generate() {
    await this.configure();
    await StashPaths.emptyTmpDir();
    await this.generateSprite();
    await this.generateVtt();
  }

  private async generateSprite() {
    log.verbose(`Generating sprite image for ${this.videoFile.path}`);

    // Create `this.chunkCount` thumbnails in the tmp directory

    const duration = this.videoFile.duration || 0;
    const stepSize = duration / this.chunkCount;
    for (let i = 0; i < this.chunkCount; i++) {
      const time = i * stepSize;
      const num = `${i}`.padStart(3, "0");
      const fileName = `thumbnail${num}.jpg`;
      const ffmpeg = new FFMpeg(this.videoFile);
      const screenshotOptions: IScreenshotOptions = {
        outputPath: StashPaths.tmpPath(fileName),
        time,
        width: this.thumbWidth,
      };
      await ffmpeg.screenshot(screenshotOptions);
    }

    // Combine all of the thumbnails into a sprite image

    const imagePaths = await FileUtils.glob("thumbnail*.jpg", { cwd: StashPaths.tmp, realpath: true });
    const images: Jimp[] = [];
    for (const imagePath of imagePaths) {
      images.push(await Jimp.read(imagePath));
    }
    const width = images[0].getWidth();
    const height = images[0].getHeight();
    const canvasWidth = width * this.cols;
    const canvasHeight = height * this.rows;
    const montage = await Jimp.create(canvasWidth, canvasHeight);
    for (let index = 0; index < images.length; index++) {
      const x = width * (index % this.cols);
      const y = height * Math.floor(index / this.rows);
      const image = images[index];
      montage.composite(image, x, y);
    }
    await montage.writeAsync(this.spriteImageOutputPath);
  }

  private async generateVtt() {
    log.verbose(`Generating sprite vtt for ${this.videoFile.path}`);

    const spriteFile = await Jimp.read(this.spriteImageOutputPath);
    const spriteFileName = FileUtils.getFileName(this.spriteImageOutputPath);
    const width = spriteFile.getWidth() / this.cols;
    const height = spriteFile.getHeight() / this.rows;

    const stepSize = this.nthFrame / this.frameRate;

    const vtt = ["WEBVTT", ""];
    for (let i = 0; i < this.chunkCount; i++) {
      const x = width * (i % this.cols);
      const y = height * Math.floor(i / this.rows);
      const startTime = VttUtils.getVttTime(i * stepSize);
      const endTime = VttUtils.getVttTime((i + 1) * stepSize);
      vtt.push(`${startTime} --> ${endTime}`);
      vtt.push(`${spriteFileName}#xywh=${x},${y},${width},${height}`);
      vtt.push("");
    }

    const resultString = vtt.join("\n");
    await FileUtils.write(resultString, this.spriteVttOutputPath);
  }
}
