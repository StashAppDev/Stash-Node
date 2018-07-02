/* tslint:disable */
/** Generated in 2018-07-01T15:47:19-07:00 */

export interface Query {
  findGallery?: Gallery | null;
  findTag?: Tag | null;
  findScenes: FindScenesResultType;
}
/** Gallery type */
export interface Gallery {
  id: string;
  checksum: string;
  path: string;
  title?: string | null;
  files?: (GalleryFilesType | null)[] | null /** Function */;
}

export interface GalleryFilesType {
  index: number;
  name?: string | null;
  path?: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

export interface FindScenesResultType {
  count: number;
  scenes: (Scene | null)[];
}

export interface Scene {
  id: string;
  title?: string | null;
  details?: string | null;
  url?: string | null;
  rating?: number | null;
  path?: string | null;
  checksum?: string | null;
  size?: string | null;
  duration?: number | null;
}

export interface Mutation {
  tagCreate?: Tag | null;
}

export interface SceneFilterType {
  rating?: number | null;
  resolution?: ResolutionEnum | null;
}

export interface FindFilterType {
  q?: string | null;
  page?: number | null;
  per_page?: number | null;
  sort?: string | null;
  direction?: SortDirectionEnum | null;
}

export interface TagCreateInput {
  name: string;
}
export interface FindGalleryQueryArgs {
  id: string;
}
export interface FindTagQueryArgs {
  id: string;
}
export interface FindScenesQueryArgs {
  scene_filter?: SceneFilterType | null;
  scene_ids?: (number | null)[] | null;
  filter?: FindFilterType | null;
}
export interface TagCreateMutationArgs {
  input: TagCreateInput;
}

export enum ResolutionEnum {
  LOW = "LOW",
  STANDARD = "STANDARD",
  STANDARD_HD = "STANDARD_HD",
  FULL_HD = "FULL_HD",
  FOUR_K = "FOUR_K"
}

export enum SortDirectionEnum {
  ASC = "ASC",
  DESC = "DESC"
}
