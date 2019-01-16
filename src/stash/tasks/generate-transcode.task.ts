import { Scene } from "../../db/models/scene.model";
import { log } from "../../logger";
import { FileUtils } from "../../utils/file.utils";
import { FFMpeg, ITranscodeOptions } from "../ffmpeg/ffmpeg";
import { VideoFile } from "../ffmpeg/video-file";
import { StashPaths } from "../paths.stash";
import { BaseTask } from "./base.task";

export class GenerateTranscodeTask extends BaseTask {
  private scene: Scene;
  private transcodePath: string;

  constructor(scene: Scene) {
    super();
    this.scene = scene;
    this.transcodePath = StashPaths.getTranscodePath(this.scene.checksum);
  }

  public async start() {
    if (!this.scene.video_codec) { throw new Error(`${this.scene.checksum} is missing video codec!`); }
    if (VideoFile.isValidVideoCodec(this.scene.video_codec)) { return; }
    if (await this.transcodeExists()) { return; }
    if (!this.scene.path) { throw new Error(`Missing scene path`); }

    log.info(`${this.scene.checksum} - Generating transcode for ${this.scene.path}...`);
    await StashPaths.emptyTmpDir();
    const videoFile = await VideoFile.create(this.scene.path);
    const ffmpeg = new FFMpeg(videoFile);
    const tmpOutputPath = StashPaths.tmpPath(`${this.scene.checksum}.mp4`);
    const transcodeOptions: ITranscodeOptions = {
      outputPath: tmpOutputPath,
    };
    await ffmpeg.transcode(transcodeOptions, (progress: string) => {
      log.info(`${this.scene.checksum} - Transcode progress: ${progress}`);
    });
    await FileUtils.move(tmpOutputPath, this.transcodePath);
    log.info(`${this.scene.checksum} - Generated transcode for ${this.scene.path}!`);
  }

  private async transcodeExists(): Promise<boolean> {
    return FileUtils.fileExists(this.transcodePath);
  }
}
