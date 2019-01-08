import fs from "fs";
import fse from "fs-extra";
import inquirer from "inquirer";
import os from "os";
import path from "path";
import { parseJsonFile, writeJsonFile } from "./utils.stash";

class Paths {
  public readonly executionDirectory: string = path.dirname(process.execPath);
  public readonly configDirectory: string = path.join(os.homedir(), ".stash");
  public readonly configFile: string = path.join(this.configDirectory, "config.json");
  public readonly databaseFile: string = path.join(this.configDirectory, "stash.sqlite");

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
    const ffmpegDirectories = [this.executionDirectory, this.configDirectory];
    const ffmpegFileName: string = os.platform() === "win32" ? "ffmpeg.exe" : "ffmpeg";
    const ffprobeFileName: string = os.platform() === "win32" ? "ffprobe.exe" : "ffprobe";
    for (const directory of ffmpegDirectories) {
      const ffmpegPath = path.join(directory, ffmpegFileName);
      const ffprobePath = path.join(directory, ffprobeFileName);
      if (fs.existsSync(ffmpegPath)) { this.ffmpeg = ffmpegPath; }
      if (fs.existsSync(ffprobePath)) { this.ffprobe = ffprobePath; }
    }

    if (!fs.existsSync(this.configFile)) { throw new Error(`config.json not found at ${this.configFile}`); }
    const ffmpegErrorText = `\nPlace it in one of the following folders:\n\n${ffmpegDirectories.join("\n")}\n`;
    if (!fs.existsSync(this.ffmpeg)) { throw new Error(`FFMPEG not found. ${ffmpegErrorText}`); }
    if (!fs.existsSync(this.ffprobe)) { throw new Error(`FFProbe not found. ${ffmpegErrorText}`); }

    const jsonConfig = parseJsonFile(this.configFile);

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

  public async ensureConfigFile() {
    if (fs.existsSync(this.configFile)) { return; }

    const validation = (value: string) => {
      if (fse.existsSync(value)) {
        return true;
      } else {
        return "Not a valid folder";
      }
    };

    return inquirer.prompt([
      { message: "Media folder path", name: "stash", type: "input", validate: validation },
      { message: "Metadata folder path", name: "metadata", type: "input", validate: validation },
      { message: "Cache folder path", name: "cache", type: "input", validate: validation },
      { message: "Downloads folder path", name: "downloads", type: "input", validate: validation },
    ]).then((answers: any) => {
      writeJsonFile(this.configFile, answers);
    });
  }

  public screenshotPath(checksum: string): string {
    return path.join(this.screenshots, `${checksum}.jpg`);
  }

  public thumbnailScreenshotPath(checksum: string): string {
    return path.join(this.screenshots, `${checksum}.thumb.jpg`);
  }

  public performerJsonPath(checksum: string) { return path.join(StashPaths.performers, `${checksum}.json`); }
  public sceneJsonPath(checksum: string) { return path.join(StashPaths.scenes, `${checksum}.json`); }
  public studioJsonPath(checksum: string) { return path.join(StashPaths.studios, `${checksum}.json`); }
}

export const StashPaths = new Paths();
