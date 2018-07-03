import fs from "fs";
import fse from "fs-extra";
import os from "os";
import path from "path";

export default class {
  public readonly stash: string;
  public readonly metadata: string;
  public readonly cache: string;
  public readonly downloads: string;

  public readonly performers: string;
  public readonly scenes: string;
  public readonly galleries: string;
  public readonly studios: string;
  public readonly screenshots: string;
  public readonly vtt: string;
  public readonly markers: string;
  public readonly transcode: string;
  public readonly mappings: string;
  public readonly scraped: string;

  public readonly ffmpeg: string;
  public readonly ffprobe: string;

  constructor() {
    const executionDirectory = path.dirname(process.execPath);
    const configPath = path.join(executionDirectory, "config.json");

    if (os.platform() === "win32") {
      this.ffmpeg = path.join(executionDirectory, "ffmpeg.exe");
      this.ffprobe = path.join(executionDirectory, "ffprobe.exe");
    } else {
      this.ffmpeg = path.join(executionDirectory, "ffmpeg");
      this.ffprobe = path.join(executionDirectory, "ffprobe");
    }

    if (!fs.existsSync(configPath)) {
      throw new Error("No config.json found");
    }

    const jsonFile = fs.readFileSync(configPath, "utf8");
    const jsonConfig = JSON.parse(jsonFile);

    this.stash       = jsonConfig.stash;
    this.metadata    = jsonConfig.metadata;
    this.cache       = jsonConfig.cache;
    this.downloads   = jsonConfig.downloads;

    this.performers  = path.join(this.metadata, "performers");
    this.scenes      = path.join(this.metadata, "scenes");
    this.galleries   = path.join(this.metadata, "galleries");
    this.studios     = path.join(this.metadata, "studios");
    this.screenshots = path.join(this.metadata, "screenshots");
    this.vtt         = path.join(this.metadata, "vtt");
    this.markers     = path.join(this.metadata, "markers");
    this.transcode   = path.join(this.metadata, "transcodes");
    this.mappings    = path.join(this.metadata, "mappings.json");
    this.scraped     = path.join(this.metadata, "scraped.json");

    fse.ensureDirSync(this.performers);
    fse.ensureDirSync(this.scenes);
    fse.ensureDirSync(this.galleries);
    fse.ensureDirSync(this.studios);
    fse.ensureDirSync(this.screenshots);
    fse.ensureDirSync(this.vtt);
    fse.ensureDirSync(this.markers);
    fse.ensureDirSync(this.transcode);
  }
}
