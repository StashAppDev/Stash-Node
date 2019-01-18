import { FileUtils } from "../../utils/file.utils";
import { VideoFile } from "../ffmpeg/video-file";

export class BaseGenerator {
  public chunkCount: number;
  public frameRate: number;
  public numberOfFrames: number;
  public nthFrame: number;

  protected filePath: string;
  protected videoFile: VideoFile;

  constructor(videoFile: VideoFile) {
    this.videoFile = videoFile;
    if (!FileUtils.fileExistsSync(videoFile.path)) { throw new Error(`The file ${videoFile.path} does not exist`); }
  }

  public async generate() {
    throw new Error("Override");
  }

  protected async configure() {
    const videoStream = VideoFile.getStreams(this.videoFile.json, "video")[0];
    if (!videoStream) { throw new Error(`No valid video stream for file '${this.videoFile.path}`); }

    this.frameRate = this.videoFile.frameRate || parseInt(videoStream.r_frame_rate, 10);
    this.numberOfFrames = parseInt(videoStream.nb_frames, 10);
    if (isNaN(this.numberOfFrames)) {
      const command = `ffmpeg -nostats -i "${this.videoFile.path}" -vcodec copy -f rawvideo -y /dev/null 2>&1 | \
                       grep frame | \
                       awk '{split($0,a,"fps")}END{print a[1]}' | \
                       sed 's/.*= *//'`;
      this.numberOfFrames = parseInt(await FileUtils.exec(command), 10);
      if (isNaN(this.numberOfFrames)) { // TODO: test
        const duration = this.videoFile.duration || 0;
        this.numberOfFrames = this.frameRate * duration;
      }
    }
    this.nthFrame = this.numberOfFrames / this.chunkCount;
  }
}
