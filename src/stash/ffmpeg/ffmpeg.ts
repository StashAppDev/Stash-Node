import { FileUtils } from "../../utils/file.utils";
import { StashPaths } from "../paths.stash";
import { VideoFile } from "./video-file";

export interface IScreenshotOptions {
  outputPath: string;
  quality?: number;
  time: number;
  width: number;
  verbosity?: "quiet" | "info";
}

export class FFMpeg {

  public videoFile: VideoFile;

  constructor(videoFile: VideoFile) {
    this.videoFile = videoFile;
  }

  public screenshot(options: IScreenshotOptions) {
    const quality = options.quality ? options.quality.toString(10) : "1";
    const args = [
      "-v", options.verbosity || "quiet",
      "-ss", options.time.toString(10),
      "-y",
      "-i", this.videoFile.path,
      "-vframes", "1",
      "-q:v", quality,
      "-vf", `scale=${options.width}:-1`,
      "-f", "image2",
      options.outputPath,
    ];
    return this.run(args);
  }

  private run(args: string[]) {
    const ffmpegPath = StashPaths.ffmpeg;
    return FileUtils.spawn(ffmpegPath, args);
  }
}
