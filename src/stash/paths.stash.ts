import fs from "fs";
import fse from "fs-extra";
import os from "os";
import path from "path";
import { Maybe } from "../typings/stash";
import { parseJsonFile } from "./utils.stash";

export class FixedPaths {
  public readonly executionDirectory: string = path.dirname(process.execPath);
  public readonly configDirectory: string = path.join(os.homedir(), ".stash");
  public readonly configFile: string = path.join(this.configDirectory, "config.json");
  public readonly databaseFile: string = path.join(this.configDirectory, "stash.sqlite");

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

    const ffmpegErrorText = `\nPlace it in one of the following folders:\n\n${ffmpegDirectories.join("\n")}\n`;
    if (!fs.existsSync(this.ffmpeg)) { throw new Error(`FFMPEG not found. ${ffmpegErrorText}`); }
    if (!fs.existsSync(this.ffprobe)) { throw new Error(`FFProbe not found. ${ffmpegErrorText}`); }
  }
}

class JsonPaths {
  public readonly mappingsFile: string;
  public readonly scrapedFile: string;

  public readonly performers: string;
  public readonly scenes: string;
  public readonly galleries: string;
  public readonly studios: string;

  constructor(paths: Paths) {
    this.mappingsFile = path.join(paths.metadata, "mappings.json");
    this.scrapedFile  = path.join(paths.metadata, "scraped.json");
    this.performers   = path.join(paths.metadata, "performers");
    this.scenes       = path.join(paths.metadata, "scenes");
    this.galleries    = path.join(paths.metadata, "galleries");
    this.studios      = path.join(paths.metadata, "studios");

    // TODO async
    fse.ensureDirSync(this.performers);
    fse.ensureDirSync(this.scenes);
    fse.ensureDirSync(this.galleries);
    fse.ensureDirSync(this.studios);
  }

  public performerJsonPath(checksum: string) { return path.join(this.performers, `${checksum}.json`); }
  public sceneJsonPath(checksum: string) { return path.join(this.scenes, `${checksum}.json`); }
  public studioJsonPath(checksum: string) { return path.join(this.studios, `${checksum}.json`); }
}

class GeneratedPaths {
  public readonly screenshots: string;
  public readonly vtt: string;
  public readonly markers: string;
  public readonly transcode: string;

  public readonly tmp: string;

  constructor(paths: Paths) {
    this.screenshots = path.join(paths.metadata, "screenshots");
    this.vtt         = path.join(paths.metadata, "vtt");
    this.markers     = path.join(paths.metadata, "markers");
    this.transcode   = path.join(paths.metadata, "transcodes");
    this.tmp         = path.join(paths.metadata, "tmp");

    // TODO async
    fse.ensureDirSync(this.screenshots);
    fse.ensureDirSync(this.vtt);
    fse.ensureDirSync(this.markers);
    fse.ensureDirSync(this.transcode);
  }

  public getTmpPath(fileName: string) { return path.join(this.tmp, fileName); }
  public async ensureTmpDir() { await fse.ensureDir(this.tmp); }
  public async emptyTmpDir() { await fse.emptyDir(this.tmp); }
  public async removeTmpDir() { await fse.remove(this.tmp); }
}

class ScenePaths {
  private generatedPaths: GeneratedPaths;

  constructor(generatedPaths: GeneratedPaths) {
    this.generatedPaths = generatedPaths;
  }

  public getScreenshotPath(checksum: string): string {
    return path.join(this.generatedPaths.screenshots, `${checksum}.jpg`);
  }

  public getThumbnailScreenshotPath(checksum: string): string {
    return path.join(this.generatedPaths.screenshots, `${checksum}.thumb.jpg`);
  }

  public getTranscodePath(checksum: Maybe<string>): string {
    return path.join(this.generatedPaths.transcode, `${checksum}.mp4`);
  }

  public getStreamPath(scenePath: Maybe<string>, checksum: Maybe<string>) {
    const transcodePath = this.getTranscodePath(checksum);
    if (fs.existsSync(transcodePath)) {
      return transcodePath;
    } else {
      return scenePath;
    }
  }

  public getStreamPreviewPath(checksum: string): string {
    return path.join(this.generatedPaths.screenshots, `${checksum}.mp4`);
  }

  public getStreamPreviewImagePath(checksum: string): string {
    return path.join(this.generatedPaths.screenshots, `${checksum}.webp`);
  }

  public getSpriteImageFilePath(checksum: Maybe<string>) {
    return path.join(this.generatedPaths.vtt, `${checksum}_sprite.jpg`);
  }

  public getSpriteVttFilePath(checksum: Maybe<string>) {
    return path.join(this.generatedPaths.vtt, `${checksum}_thumbs.vtt`);
  }
}

class SceneMarkerPaths {
  private generatedPaths: GeneratedPaths;

  constructor(generatedPaths: GeneratedPaths) {
    this.generatedPaths = generatedPaths;
  }

  public getStreamPath(checksum: string, seconds: number): string {
    return path.join(this.generatedPaths.markers, checksum, `${seconds}.mp4`);
  }

  public getStreamPreviewImagePath(checksum: string, seconds: number): string {
    return path.join(this.generatedPaths.markers, checksum, `${seconds}.webp`);
  }
}

export class Paths {
  public fixed: FixedPaths;
  public generated: GeneratedPaths;
  public json: JsonPaths;
  public scene: ScenePaths;
  public sceneMarker: SceneMarkerPaths;

  public readonly stash: string;
  public readonly metadata: string;
  // public readonly generated: string; // TODO: Generated directory instead of metadata
  public readonly cache: string;
  public readonly downloads: string;

  constructor(fixedPaths: FixedPaths) {
    this.fixed = fixedPaths;

    const jsonConfig = parseJsonFile(this.fixed.configFile);

    this.stash       = jsonConfig.stash;
    this.metadata    = jsonConfig.metadata;
    this.cache       = jsonConfig.cache;
    this.downloads   = jsonConfig.downloads;

    this.generated = new GeneratedPaths(this);
    this.json = new JsonPaths(this);
    this.scene = new ScenePaths(this.generated);
    this.sceneMarker = new SceneMarkerPaths(this.generated);
  }
}
