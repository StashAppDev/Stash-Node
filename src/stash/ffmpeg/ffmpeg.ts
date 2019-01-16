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

export interface ITranscodeOptions {
  outputPath: string;
}

type OnProgressCallback = (progress: string) => void;

export class FFMpeg {
  public static readonly PROGRESS_REGEX = new RegExp(/time=(\d+):(\d+):(\d+.\d+)/);

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
      "-i", this.videoFile.path, // TODO: Wrap in quotes?
      "-vframes", "1",
      "-q:v", quality,
      "-vf", `scale=${options.width}:-1`,
      "-f", "image2",
      options.outputPath,
    ];
    return this.run(args);
  }

  public transcode(options: ITranscodeOptions, onProgress?: OnProgressCallback) {
    const args = [
      "-i", this.videoFile.path,
      "-c:v", "libx264",
      "-profile:v", "high",
      "-level", "4.2",
      "-preset", "superfast",
      "-crf", "23",
      "-vf", "scale=iw:-2",
      "-c:a", "aac",
      options.outputPath,
    ];
    return this.run(args, onProgress);
  }

  private run(args: string[], onProgress?: OnProgressCallback) {
    const ffmpegPath = StashPaths.ffmpeg;
    return FileUtils.spawn(ffmpegPath, args, undefined, (data: any) => {
      const dataString = data.toString();
      const regexResult = FFMpeg.PROGRESS_REGEX.exec(dataString);
      if (!!regexResult && regexResult.length === 4 && !!onProgress && !!this.videoFile.duration) {
        const hours = parseInt(regexResult[1], 10) * 3600;
        const mins = parseInt(regexResult[2], 10) * 60;
        const secs = parseFloat(regexResult[3]);
        const time = hours + mins + secs;
        const progress = (time / this.videoFile.duration).toFixed(2);
        onProgress(progress);
      }
    });
  }
}
