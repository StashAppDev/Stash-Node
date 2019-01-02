/* tslint:disable */
// Generated in 2019-01-01T17:12:26-08:00
export type Maybe<T> = T | null;

export interface SceneFilterType {
  rating?: Maybe<number>;

  resolution?: Maybe<ResolutionEnum>;
}

export interface FindFilterType {
  q?: Maybe<string>;

  page?: Maybe<number>;

  per_page?: Maybe<number>;

  sort?: Maybe<string>;

  direction?: Maybe<SortDirectionEnum>;
}

export interface StudioCreateInput {
  name: string;

  url?: Maybe<string>;

  image: string;
}

export interface StudioUpdateInput {
  id: string;

  name?: Maybe<string>;

  url?: Maybe<string>;

  image?: Maybe<string>;
}

export interface TagCreateInput {
  name: string;
}

export interface TagUpdateInput {
  id: string;

  name: string;
}

export enum ResolutionEnum {
  Low = "LOW",
  Standard = "STANDARD",
  StandardHd = "STANDARD_HD",
  FullHd = "FULL_HD",
  FourK = "FOUR_K"
}

export enum SortDirectionEnum {
  Asc = "ASC",
  Desc = "DESC"
}

// ====================================================
// Types
// ====================================================

export interface Query {
  findScenes: FindScenesResultType;

  findStudio?: Maybe<Studio>;

  findStudios: FindStudiosResultType;

  findGallery?: Maybe<Gallery>;

  findTag?: Maybe<Tag>;

  stats: StatsResultType;
}

export interface FindScenesResultType {
  count: number;

  scenes: (Maybe<Scene>)[];
}

export interface Scene {
  id: string;

  checksum: string;

  title?: Maybe<string>;

  details?: Maybe<string>;

  url?: Maybe<string>;

  date?: Maybe<string>;

  rating?: Maybe<number>;

  path: string;

  file: SceneFileType;

  paths: ScenePathsType;

  is_streamable: boolean;

  scene_markers: (Maybe<SceneMarker>)[];

  gallery?: Maybe<Gallery>;

  studio?: Maybe<Studio>;

  tags: (Maybe<Tag>)[];

  performers: (Maybe<Performer>)[];

  scene_marker_tags: (Maybe<SceneMarkerTag>)[];
}

export interface SceneFileType {
  size?: Maybe<string>;

  duration?: Maybe<number>;

  video_codec?: Maybe<string>;

  audio_codec?: Maybe<string>;

  width?: Maybe<number>;

  height?: Maybe<number>;
}

export interface ScenePathsType {
  screenshot?: Maybe<string>;

  preview?: Maybe<string>;

  stream?: Maybe<string>;

  webp?: Maybe<string>;

  vtt?: Maybe<string>;

  chapters_vtt?: Maybe<string>;
}

export interface SceneMarker {
  id: string;

  scene: Scene;

  title: string;

  seconds: number;

  primary_tag: Tag;

  tags: (Maybe<Tag>)[];

  stream: string;

  preview: string;
}

export interface Tag {
  id: string;

  name: string;

  scene_count?: Maybe<number>;

  scene_marker_count?: Maybe<number>;
}

/** Gallery type */
export interface Gallery {
  id: string;

  checksum: string;

  path: string;

  title?: Maybe<string>;
  /** The files in the gallery */
  files: (Maybe<GalleryFilesType>)[];
}

export interface GalleryFilesType {
  index: number;

  name?: Maybe<string>;

  path?: Maybe<string>;
}

export interface Studio {
  id: string;

  checksum: string;

  name: string;

  url?: Maybe<string>;

  image_path?: Maybe<string>;

  scene_count?: Maybe<number>;
}

export interface Performer {
  id: string;

  checksum: string;

  name?: Maybe<string>;

  url?: Maybe<string>;

  twitter?: Maybe<string>;

  instagram?: Maybe<string>;

  birthdate?: Maybe<string>;

  ethnicity?: Maybe<string>;

  country?: Maybe<string>;

  eye_color?: Maybe<string>;

  height?: Maybe<string>;

  measurements?: Maybe<string>;

  fake_tits?: Maybe<string>;

  career_length?: Maybe<string>;

  tattoos?: Maybe<string>;

  piercings?: Maybe<string>;

  aliases?: Maybe<string>;

  favorite: boolean;

  image_path?: Maybe<string>;

  scene_count?: Maybe<number>;

  scenes: (Maybe<Scene>)[];
}

export interface SceneMarkerTag {
  tag?: Maybe<Tag>;

  scene_markers: (Maybe<SceneMarker>)[];
}

export interface FindStudiosResultType {
  count: number;

  studios: (Maybe<Studio>)[];
}

export interface StatsResultType {
  scene_count: number;

  gallery_count: number;

  performer_count: number;

  studio_count: number;

  tag_count: number;
}

export interface Mutation {
  studioCreate?: Maybe<Studio>;

  studioUpdate?: Maybe<Studio>;

  tagCreate?: Maybe<Tag>;

  tagUpdate?: Maybe<Tag>;
}

/** A performer from a scraping operation... */
export interface ScrapedPerformer {
  name?: Maybe<string>;

  url?: Maybe<string>;

  twitter?: Maybe<string>;

  instagram?: Maybe<string>;

  birthdate?: Maybe<string>;

  ethnicity?: Maybe<string>;

  country?: Maybe<string>;

  eye_color?: Maybe<string>;

  height?: Maybe<string>;

  measurements?: Maybe<string>;

  fake_tits?: Maybe<string>;

  career_length?: Maybe<string>;

  tattoos?: Maybe<string>;

  piercings?: Maybe<string>;

  aliases?: Maybe<string>;
}

// ====================================================
// Arguments
// ====================================================

export interface FindScenesQueryArgs {
  scene_filter?: Maybe<SceneFilterType>;

  scene_ids?: Maybe<(Maybe<number>)[]>;

  filter?: Maybe<FindFilterType>;
}
export interface FindStudioQueryArgs {
  id: string;
}
export interface FindStudiosQueryArgs {
  filter?: Maybe<FindFilterType>;
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
