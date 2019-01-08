import { StashManager } from "./manager.stash";
import { StashPaths } from "./paths.stash";
import { parseJsonFile, writeJsonFile } from "./utils.stash";

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
  date?: string; // TODO: date?
  rating?: string;
  tags?: string;
  models?: string;
  episode?: number;
  gallery_filename?: string;
  gallery_url?: string;
  video_filename?: string;
  video_url?: string;
  studio: string;
  updated_at: Date; // TODO: date?
}

export interface IStudioJson extends IJsonObject {
  name?: string;
  url?: string;
  image: string;
}

class Json {
  public getMappings(): IMappingJson {
    return parseJsonFile(StashPaths.mappings);
  }

  public saveMappings(json: IMappingJson) {
    StashManager.info("Saving mapping file...");
    writeJsonFile(StashPaths.mappings, json);
  }

  public getScraped(): IScrapedJson {
    return parseJsonFile(StashPaths.scraped);
  }

  public getPerformer(checksum: string): IPerformerJson {
    return parseJsonFile(StashPaths.performerJsonPath(checksum));
  }

  public getScene(checksum: string): ISceneJson {
    return parseJsonFile(StashPaths.sceneJsonPath(checksum));
  }

  public getStudio(checksum: string): IStudioJson {
    return parseJsonFile(StashPaths.studioJsonPath(checksum));
  }

}

export const StashJson = new Json();
