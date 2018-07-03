import childProcess from 'child_process';
import fs from 'fs';
import { Manager } from './manager.stash';
import mathjs from 'mathjs';

// TODO: Schema base off this https://raw.githubusercontent.com/FFmpeg/FFmpeg/master/doc/ffprobe.xsd
// https://github.com/streamio/streamio-ffmpeg/blob/master/lib/ffmpeg/movie.rb

export class FFProbe {
  readonly metadata: any

  readonly path: string;
  readonly container: string;
  readonly duration: number;
  readonly startTime: number;
  readonly bitrate: number;
  readonly size: number;
  readonly creationTime: Date;

  readonly videoCodec: string;
  readonly videoBitrate: string;
  readonly width: number;
  readonly height: number;
  readonly frameRate: number;
  readonly rotation: number;

  readonly audioCodec: string;

  constructor(filePath: string) {
    // TODO: Async?
    const params = ['-show_streams', '-count_frames', '-show_format', '-show_error', '-print_format', 'json', filePath];
    const ffprobe = childProcess.spawnSync(Manager.getInstance().paths.ffprobe, params);

    if (ffprobe.error) {
      throw ffprobe.error;
    }

    this.metadata = JSON.parse(ffprobe.stdout.toString());

    this.path = filePath;

    const videoStreams = this.metadata.streams.filter((stream: any) => !!stream.codec_type && stream.codec_type === 'video');
    const audioStreams = this.metadata.streams.filter((stream: any) => !!stream.codec_type && stream.codec_type === 'audio');

    this.container = this.metadata.format.format_name;
    this.duration = parseFloat(this.metadata.format.duration);
    this.startTime = parseFloat(this.metadata.format.start_time);
    this.bitrate = parseInt(this.metadata.format.bitrate);
    this.size = fs.statSync(filePath)['size'];

    if (!!this.metadata.format && !!this.metadata.format.tags) {
      this.creationTime = new Date(this.metadata.format.tags.creation_time);
    }

    if (!!videoStreams[0]) {
      const stream = videoStreams[0];
      this.videoCodec = stream.codec_name;
      this.videoBitrate = stream.bit_rate;
      this.frameRate = mathjs.number(mathjs.fraction(stream.avg_frame_rate)) as number;

      if (!!stream.tags && !!stream.tags.rotate) {
        this.rotation = parseInt(stream.tags.rotate);
        if (this.rotation != 180) {
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
      this.audioCodec = stream.codec_name
    }
  }

}
