import childProcess from "child_process";
import fs from "fs";
import mathjs from "mathjs";
import os from "os";
import { StashPaths } from "./paths.stash";

// TODO: Schema base off this https://raw.githubusercontent.com/FFmpeg/FFmpeg/master/doc/ffprobe.xsd
// https://github.com/streamio/streamio-ffmpeg/blob/master/lib/ffmpeg/movie.rb

export class FFProbe {
  public readonly metadata: any;

  public readonly path: string;
  public readonly container: string;
  public readonly duration: number;
  public readonly startTime: number;
  public readonly bitrate: number;
  public readonly size: number;
  public readonly creationTime: Date;

  public readonly videoCodec: string;
  public readonly videoBitrate: string;
  public readonly width: number;
  public readonly height: number;
  public readonly frameRate: number;
  public readonly rotation: number;

  public readonly audioCodec: string;

  constructor(filePath: string) {
    // TODO: Async?
    const params = ["-show_streams", "-show_format", "-show_error", "-print_format", "json", filePath];
    if (os.platform() !== "win32") { params.push("-count_frames"); }
    const ffprobe = childProcess.spawnSync(StashPaths.ffprobe, params);

    if (ffprobe.error) {
      throw ffprobe.error;
    }

    this.metadata = JSON.parse(ffprobe.stdout.toString());
    if (!!this.metadata.error) {
      const error = this.metadata.error;
      throw new Error(`FFProbe [${filePath}] -> Code: ${error.code}, Message: ${error.string}`);
    }

    this.path = filePath;

    const videoStreams = this.metadata.streams.filter((stream: any) => {
      return !!stream.codec_type && stream.codec_type === "video";
    });
    const audioStreams = this.metadata.streams.filter((stream: any) => {
      return !!stream.codec_type && stream.codec_type === "audio";
    });

    this.container = this.metadata.format.format_name;
    this.duration = parseFloat(this.metadata.format.duration);
    this.startTime = parseFloat(this.metadata.format.start_time);
    this.bitrate = parseInt(this.metadata.format.bitrate, 10);
    this.size = fs.statSync(filePath).size;

    if (!!this.metadata.format && !!this.metadata.format.tags) {
      this.creationTime = new Date(this.metadata.format.tags.creation_time);
    }

    if (!!videoStreams[0]) {
      const stream = videoStreams[0];
      this.videoCodec = stream.codec_name;
      this.videoBitrate = stream.bit_rate;
      this.frameRate = mathjs.number(mathjs.fraction(stream.avg_frame_rate)) as number;

      if (!!stream.tags && !!stream.tags.rotate) {
        this.rotation = parseInt(stream.tags.rotate, 10);
        if (this.rotation !== 180) {
          this.width = stream.height;
          this.height = stream.width;
        }
      } else {
        this.width = stream.width;
        this.height = stream.height;
      }
    }

    if (!!audioStreams[0]) {
      const stream = audioStreams[0];
      this.audioCodec = stream.codec_name;
    }
  }

}
