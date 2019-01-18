import { FileUtils } from "../utils/file.utils";
import { StashManager } from "./manager.stash";
import { Stash } from "./stash";

export type IJsonObject = any;

export interface IMappingJson extends IJsonObject {
  performers: Array<{name: string, checksum: string}>;
  studios: Array<{name: string, checksum: string}>;
  galleries: Array<{path: string, checksum: string}>;
  scenes: Array<{path: string, checksum: string}>;
}

export type IScrapedJson = IScrapedItemJson[];

export interface IPerformerJson extends IJsonObject {
  name?: string;
  url?: string;
  twitter?: string;
  instagram?: string;
  birthdate?: string;
  ethnicity?: string;
  country?: string;
  eye_color?: string;
  height?: string;
  measurements?: string;
  fake_tits?: string;
  career_length?: string;
  tattoos?: string;
  piercings?: string;
  aliases?: string;
  favorite: boolean;
  image: string;
}

export interface ISceneMarkerJson extends IJsonObject {
  title: string;
  seconds: number;
  primary_tag: string;
  tags: string[];
}

export interface ISceneJson extends IJsonObject {
  title?: string;
  studio?: string;
  url?: string;
  date?: string;
  rating?: number;
  details?: string;
  gallery?: string;
  performers?: string[];
  tags?: string[];
  markers?: ISceneMarkerJson[];
  file?: {
    size?: string;
    duration?: number;
    video_codec?: string;
    audio_codec?: string;
    width?: number;
    height?: number;
    framerate?: number;
    bitrate?: number;
  };
}

export interface IScrapedItemJson extends IJsonObject {
  title?: string;
  description?: string;
  url?: string;
  date?: string;
  rating?: string;
  tags?: string;
  models?: string;
  episode?: number;
  gallery_filename?: string;
  gallery_url?: string;
  video_filename?: string;
  video_url?: string;
  studio: string;
  updated_at: string;
}

export interface IStudioJson extends IJsonObject {
  name?: string;
  url?: string;
  image: string;
}

class Json {
  public getMappings(): Promise<IMappingJson> {
    return FileUtils.readJson(Stash.paths.json.mappingsFile);
  }

  public saveMappings(json: IMappingJson): Promise<void> {
    StashManager.info("Saving mapping file...");
    return FileUtils.writeJson(Stash.paths.json.mappingsFile, json);
  }

  public getScraped(): Promise<IScrapedJson> {
    return FileUtils.readJson(Stash.paths.json.scrapedFile);
  }

  public getPerformer(checksum: string): Promise<IPerformerJson> {
    return FileUtils.readJson(Stash.paths.json.performerJsonPath(checksum));
  }

  public getScene(checksum: string): Promise<ISceneJson> {
    return FileUtils.readJson(Stash.paths.json.sceneJsonPath(checksum));
  }

  public getStudio(checksum: string): Promise<IStudioJson> {
    return FileUtils.readJson(Stash.paths.json.studioJsonPath(checksum));
  }
}

export const StashJson = new Json();
