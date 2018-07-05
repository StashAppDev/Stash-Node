/* tslint:disable */
/** Generated in 2018-07-04T23:20:45-07:00 */

export interface Query {
  findScenes: FindScenesResultType;
  findStudio?: Studio | null;
  findStudios: FindStudiosResultType;
  findGallery?: Gallery | null;
  findTag?: Tag | null;
}

export interface FindScenesResultType {
  count: number;
  scenes: (Scene | null)[];
}

export interface Scene {
  id: string;
  checksum: string;
  title?: string | null;
  details?: string | null;
  url?: string | null;
  date?: string | null;
  rating?: number | null;
  path: string;
  file: SceneFileType;
  paths: ScenePathsType;
  is_streamable: boolean;
  scene_markers: (SceneMarker | null)[];
  gallery?: Gallery | null;
  studio?: Studio | null;
  tags: (Tag | null)[];
  performers: (Performer | null)[];
  scene_marker_tags: (SceneMarkerTag | null)[];
}

export interface SceneFileType {
  size?: string | null;
  duration?: number | null;
  video_codec?: string | null;
  audio_codec?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ScenePathsType {
  screenshot?: string | null;
  preview?: string | null;
  stream?: string | null;
  webp?: string | null;
  vtt?: string | null;
  chapters_vtt?: string | null;
}

export interface SceneMarker {
  id: string;
  scene: Scene;
  title: string;
  seconds: number;
  primary_tag: Tag;
  tags: (Tag | null)[];
  stream: string;
  preview: string;
}

export interface Tag {
  id: string;
  name: string;
  scene_count?: number | null;
  scene_marker_count?: number | null;
}
/** Gallery type */
export interface Gallery {
  id: string;
  checksum: string;
  path: string;
  title?: string | null;
  files: (GalleryFilesType | null)[] /** The files in the gallery */;
}

export interface GalleryFilesType {
  index: number;
  name?: string | null;
  path?: string | null;
}

export interface Studio {
  id: string;
  checksum: string;
  name: string;
  url?: string | null;
  image_path?: string | null;
  scene_cound?: number | null;
}

export interface Performer {
  id: string;
  checksum: string;
  name?: string | null;
  url?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  birthdate?: string | null;
  ethnicity?: string | null;
  country?: string | null;
  eye_color?: string | null;
  height?: string | null;
  measurements?: string | null;
  fake_tits?: string | null;
  career_length?: string | null;
  tattoos?: string | null;
  piercings?: string | null;
  aliases?: string | null;
  favorite: boolean;
  image_path?: string | null;
  scene_count?: number | null;
  scenes: (Scene | null)[];
}

export interface SceneMarkerTag {
  tag?: Tag | null;
  scene_markers: (SceneMarker | null)[];
}

export interface FindStudiosResultType {
  count: number;
  studios: (Studio | null)[];
}

export interface Mutation {
  studioCreate?: Studio | null;
  studioUpdate?: Studio | null;
  tagCreate?: Tag | null;
  tagUpdate?: Tag | null;
}
/** A performer from a scraping operation... */
export interface ScrapedPerformer {
  name?: string | null;
  url?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  birthdate?: string | null;
  ethnicity?: string | null;
  country?: string | null;
  eye_color?: string | null;
  height?: string | null;
  measurements?: string | null;
  fake_tits?: string | null;
  career_length?: string | null;
  tattoos?: string | null;
  piercings?: string | null;
  aliases?: string | null;
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

export interface StudioCreateInput {
  name: string;
  url?: string | null;
  image: string;
}

export interface StudioUpdateInput {
  id: string;
  name?: string | null;
  url?: string | null;
  image?: string | null;
}

export interface TagCreateInput {
  name: string;
}

export interface TagUpdateInput {
  id: string;
  name: string;
}
export interface FindScenesQueryArgs {
  scene_filter?: SceneFilterType | null;
  scene_ids?: (number | null)[] | null;
  filter?: FindFilterType | null;
}
export interface FindStudioQueryArgs {
  id: string;
}
export interface FindStudiosQueryArgs {
  filter?: FindFilterType | null;
}
export interface FindGalleryQueryArgs {
  id: string;
}
export interface FindTagQueryArgs {
  id: string;
}
export interface StudioCreateMutationArgs {
  input: StudioCreateInput;
}
export interface StudioUpdateMutationArgs {
  input: StudioUpdateInput;
}
export interface TagCreateMutationArgs {
  input: TagCreateInput;
}
export interface TagUpdateMutationArgs {
  input: TagUpdateInput;
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
