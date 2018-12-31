import childProcess from "child_process";
import { FFProbe } from "./ffprobe.stash";
import { StashPaths } from "./paths.stash";

export class FFMpeg {

  public filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  public screenshot(movie: FFProbe, outputPath: string, quality: number, width: number) {
    const args = [
      "-ss", (movie.duration * 0.2).toString(),
      "-y",
      "-i", this.filePath,
      "-vframes", "1",
      "-q:v", "1",
      "-vf", `scale=${width}:-1`,
      "-f", "image2",
      outputPath,
    ];
    return this.run(args);
  }

  private run(args: string[]) {
    const ffmpegPath = StashPaths.ffmpeg;
    return this.spawn(ffmpegPath, args);
  }

  private spawn(file: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      let stdout = "";
      let stderr = "";

      const process = childProcess.spawn(file, args, {});
      process.once("close", (code, signal) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          const error = stderr.split("\n").filter(Boolean).pop();
          reject(new Error(`FFMPEG: ${error}`));
        }
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });
    });
  }
}
