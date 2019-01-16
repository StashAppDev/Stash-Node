// tslint:disable:member-ordering
import fse from "fs-extra";
import mathjs from "mathjs";
import os from "os";
import { FileUtils } from "../../utils/file.utils";
import { StashPaths } from "../paths.stash";

// TODO: Schema base off this https://raw.githubusercontent.com/FFmpeg/FFmpeg/master/doc/ffprobe.xsd
// https://github.com/streamio/streamio-ffmpeg/blob/master/lib/ffmpeg/movie.rb

interface IFFProbeData {
  json: any;

  path: string;
  container?: string;
  duration?: number;
  startTime?: number;
  bitrate?: number;
  size?: number;
  creationTime?: Date;

  videoCodec?: string;
  videoBitrate?: string;
  width?: number;
  height?: number;
  frameRate?: number;
  rotation?: number;

  audioCodec?: string;
}

export class VideoFile implements IFFProbeData {
  private static readonly VALID_HTML5_CODECS = ["h264", "h265", "vp8", "vp9"];

  public static isValidVideoCodec(videoCodec: string) {
    return VideoFile.VALID_HTML5_CODECS.includes(videoCodec);
  }

  public readonly json: any;

  public readonly path: string;
  public readonly container?: string;
  public readonly duration?: number;
  public readonly startTime?: number;
  public readonly bitrate?: number;
  public readonly size?: number;
  public readonly creationTime?: Date;

  public readonly videoCodec?: string;
  public readonly videoBitrate?: string;
  public readonly width?: number;
  public readonly height?: number;
  public readonly frameRate?: number;
  public readonly rotation?: number;

  public readonly audioCodec?: string;

  private constructor(json: any, data: IFFProbeData) {
    this.json = json;

    this.path = data.path;

    this.container = data.container;
    this.duration = data.duration;
    this.startTime = data.startTime;
    this.bitrate = data.bitrate;
    this.size = data.size;
    this.creationTime = data.creationTime;

    this.videoCodec = data.videoCodec;
    this.videoBitrate = data.videoBitrate;
    this.width = data.width;
    this.height = data.height;
    this.frameRate = data.frameRate;
    this.rotation = data.rotation;

    this.audioCodec = data.audioCodec;
  }

  public static async create(filePath: string) {
    try {
      return await this._create(filePath);
    } catch (e) {
      throw e;
    }
  }

  public static getStreams(json: any, type: "video" | "audio"): any[] {
    return json.streams.filter((stream: any) => {
      return !!stream.codec_type && stream.codec_type === type;
    });
  }

  private static async _create(filePath: string) {
    const fileExists = await FileUtils.fileExists(filePath);
    if (!fileExists) { throw new Error(`Video file does not exist at ${filePath}!`); }
    const params = ["-show_streams", "-show_format", "-show_error", "-print_format", "json", filePath];
    if (os.platform() !== "win32") { params.push("-count_frames"); }
    const ffprobeResult = await FileUtils.spawn(StashPaths.ffprobe, params);

    const json = JSON.parse(ffprobeResult.stdout);
    if (!!json.error) {
      const error = json.error;
      throw new Error(`FFProbe [${filePath}] -> Code: ${error.code}, Message: ${error.string}`);
    } else if (ffprobeResult.stderr.includes("could not find codec parameters")) {
      throw new Error(`FFProbe [${filePath}] -> Could not find codec parameters`);
    } // TODO nil_or_unsupported.(video_stream) && nil_or_unsupported.(audio_stream)

    const videoStreams = VideoFile.getStreams(json, "video");
    const audioStreams = VideoFile.getStreams(json, "audio");

    const data: Partial<IFFProbeData> = {
      json,

      path: filePath,

      bitrate: parseInt(json.format.bitrate, 10),
      container: json.format.format_name,
      duration: parseFloat(json.format.duration),
      size: (await fse.stat(filePath)).size,
      startTime: parseFloat(json.format.start_time),
    };

    if (!!json.format && !!json.format.tags) {
      data.creationTime = new Date(json.format.tags.creation_time);
    }

    if (!!videoStreams[0]) {
      const stream = videoStreams[0];
      data.videoCodec = stream.codec_name;
      data.videoBitrate = stream.bit_rate;
      data.frameRate = mathjs.number(mathjs.fraction(stream.avg_frame_rate)) as number;

      if (!!stream.tags && !!stream.tags.rotate) {
        data.rotation = parseInt(stream.tags.rotate, 10);
        if (data.rotation !== 180) {
          data.width = stream.height;
          data.height = stream.width;
        }
      } else {
        data.width = stream.width;
        data.height = stream.height;
      }
    }

    if (!!audioStreams[0]) {
      const stream = audioStreams[0];
      data.audioCodec = stream.codec_name;
    }

    return new VideoFile(json, data as IFFProbeData);
  }

}
