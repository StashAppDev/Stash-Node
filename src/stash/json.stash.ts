import { StashManager } from "./manager.stash";
import { StashPaths } from "./paths.stash";
import { parseJsonFile, writeJsonFile } from "./utils.stash";

export type IJsonObject = any;

export interface IMappingJson extends IJsonObject {
  performers?: Array<{name: string, checksum: string}>;
  studios?: Array<{name: string, checksum: string}>;
  galleries?: Array<{path: string, checksum: string}>;
  scenes?: Array<{path: string, checksum: string}>;
}

export interface IPerformerJson extends IJsonObject {
  checksum?: string;
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
  favorite?: boolean;
  image?: string;
}

export interface IStudioJson extends IJsonObject {
  checksum?: string;
  name?: string;
  image: string;
  url?: string;
}

class Json {
  public getMappings(): IMappingJson {
    return parseJsonFile(StashPaths.mappings);
  }

  public saveMappings(json: IMappingJson) {
    StashManager.info("Saving mapping file...");
    writeJsonFile(StashPaths.mappings, json);
  }

  public getPerformer(checksum: string): IPerformerJson {
    return parseJsonFile(StashPaths.performerJsonPath(checksum));
  }

  public getStudio(checksum: string): IStudioJson {
    return parseJsonFile(StashPaths.studioJsonPath(checksum));
  }

}

export const StashJson = new Json();
