/* tslint:disable */
// Generated in 2019-01-21T08:33:09-08:00
export type Maybe<T> = T | undefined;

export interface SceneFilterType {
  /** Filter by rating */
  rating?: Maybe<number>;
  /** Filter by resolution */
  resolution?: Maybe<ResolutionEnum>;
  /** Filter to only include scenes which have markers. `true` or `false` */
  has_markers?: Maybe<string>;
  /** Filter to only include scenes missing this property */
  is_missing?: Maybe<string>;
  /** Filter to only include scenes with this studio */
  studio_id?: Maybe<string>;
  /** Filter to only include scenes with these tags */
  tags?: Maybe<string[]>;
  /** Filter to only include scenes with this performer */
  performer_id?: Maybe<string>;
}

export interface FindFilterType {
  q?: Maybe<string>;

  page?: Maybe<number>;

  per_page?: Maybe<number>;

  sort?: Maybe<string>;

  direction?: Maybe<SortDirectionEnum>;
}

export interface SceneMarkerFilterType {
  /** Filter to only include scene markers with this tag */
  tag_id?: Maybe<string>;
  /** Filter to only include scene markers with these tags */
  tags?: Maybe<string[]>;
  /** Filter to only include scene markers attached to a scene with these tags */
  scene_tags?: Maybe<string[]>;
  /** Filter to only include scene markers with these performers */
  performers?: Maybe<string[]>;
}

export interface PerformerFilterType {
  /** Filter by favorite */
  filter_favorites?: Maybe<boolean>;
}

export interface SceneUpdateInput {
  clientMutationId?: Maybe<string>;

  id: string;

  title?: Maybe<string>;

  details?: Maybe<string>;

  url?: Maybe<string>;

  date?: Maybe<string>;

  rating?: Maybe<number>;

  studio_id?: Maybe<string>;

  gallery_id?: Maybe<string>;

  performer_ids?: Maybe<string[]>;

  tag_ids?: Maybe<string[]>;
}

export interface SceneMarkerCreateInput {
  title: string;

  seconds: number;

  scene_id: string;

  primary_tag_id: string;

  tag_ids?: Maybe<string[]>;
}

export interface SceneMarkerUpdateInput {
  id: string;

  title: string;

  seconds: number;

  scene_id: string;

  primary_tag_id: string;

  tag_ids?: Maybe<string[]>;
}

export interface PerformerCreateInput {
  name?: Maybe<string>;

  url?: Maybe<string>;

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

  twitter?: Maybe<string>;

  instagram?: Maybe<string>;

  favorite?: Maybe<boolean>;
  /** This should be base64 encoded */
  image: string;
}

export interface PerformerUpdateInput {
  id: string;

  name?: Maybe<string>;

  url?: Maybe<string>;

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

  twitter?: Maybe<string>;

  instagram?: Maybe<string>;

  favorite?: Maybe<boolean>;
  /** This should be base64 encoded */
  image?: Maybe<string>;
}

export interface StudioCreateInput {
  name: string;

  url?: Maybe<string>;
  /** This should be base64 encoded */
  image: string;
}

export interface StudioUpdateInput {
  id: string;

  name?: Maybe<string>;

  url?: Maybe<string>;
  /** This should be base64 encoded */
  image?: Maybe<string>;
}

export interface TagCreateInput {
  name: string;
}

export interface TagUpdateInput {
  id: string;

  name: string;
}

export interface TagDestroyInput {
  id: string;
}

export type ResolutionEnum =
  | "LOW"
  | "STANDARD"
  | "STANDARD_HD"
  | "FULL_HD"
  | "FOUR_K";

export type SortDirectionEnum = "ASC" | "DESC";
export namespace GQL {
  // ====================================================
  // Types
  // ====================================================

  /** The query root for this schema */
  export interface Query {
    /** Find a scene by ID or Checksum */
    findScene?: Maybe<Scene>;
    /** A function which queries Scene objects */
    findScenes: FindScenesResultType;
    /** A function which queries SceneMarker objects */
    findSceneMarkers: FindSceneMarkersResultType;
    /** Find a performer by ID */
    findPerformer?: Maybe<Performer>;
    /** A function which queries Performer objects */
    findPerformers: FindPerformersResultType;
    /** Find a studio by ID */
    findStudio?: Maybe<Studio>;
    /** A function which queries Studio objects */
    findStudios: FindStudiosResultType;

    findGallery?: Maybe<Gallery>;

    findGalleries: FindGalleriesResultType;

    findTag?: Maybe<Tag>;
    /** Retrieve random scene markers for the wall */
    markerWall: SceneMarker[];
    /** Retrieve random scenes for the wall */
    sceneWall: Scene[];
    /** Get marker strings */
    markerStrings: (Maybe<MarkerStringsResultType>)[];
    /** Get the list of valid galleries for a given scene ID */
    validGalleriesForScene: Gallery[];
    /** Get stats */
    stats: StatsResultType;
    /** Organize scene markers by tag for a given scene ID */
    sceneMarkerTags: SceneMarkerTag[];
    /** Scrape a performer using Freeones */
    scrapeFreeones?: Maybe<ScrapedPerformer>;
    /** Scrape a list of performers from a query */
    scrapeFreeonesPerformerList: string[];
    /** Start an import. Returns the job ID */
    metadataImport: string;
    /** Start an export. Returns the job ID */
    metadataExport: string;
    /** Start a scan. Returns the job ID */
    metadataScan: string;
    /** Start generating content. Returns the job ID */
    metadataGenerate: string;
    /** Clean metadata. Returns the job ID */
    metadataClean: string;

    allPerformers: Performer[];

    allStudios: Studio[];

    allTags: Tag[];

    allSceneMarkers: SceneMarker[];
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

    scene_markers: SceneMarker[];

    gallery?: Maybe<Gallery>;

    studio?: Maybe<Studio>;

    tags: Tag[];

    performers: Performer[];

    scene_marker_tags: SceneMarkerTag[];
  }

  export interface SceneFileType {
    size?: Maybe<string>;

    duration?: Maybe<number>;

    video_codec?: Maybe<string>;

    audio_codec?: Maybe<string>;

    width?: Maybe<number>;

    height?: Maybe<number>;

    framerate?: Maybe<number>;

    bitrate?: Maybe<number>;
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

    tags: Tag[];
    /** The path to stream this marker */
    stream: string;
    /** The path to the preview image for this marker */
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
    files: GalleryFilesType[];
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

    scenes: Scene[];
  }

  export interface SceneMarkerTag {
    tag: Tag;

    scene_markers: SceneMarker[];
  }

  export interface FindScenesResultType {
    count: number;

    scenes: Scene[];
  }

  export interface FindSceneMarkersResultType {
    count: number;

    scene_markers: SceneMarker[];
  }

  export interface FindPerformersResultType {
    count: number;

    performers: Performer[];
  }

  export interface FindStudiosResultType {
    count: number;

    studios: Studio[];
  }

  export interface FindGalleriesResultType {
    count: number;

    galleries: Gallery[];
  }

  export interface MarkerStringsResultType {
    count: number;

    id: string;

    title: string;
  }

  export interface StatsResultType {
    scene_count: number;

    gallery_count: number;

    performer_count: number;

    studio_count: number;

    tag_count: number;
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

  export interface Mutation {
    sceneUpdate?: Maybe<Scene>;

    sceneMarkerCreate?: Maybe<SceneMarker>;

    sceneMarkerUpdate?: Maybe<SceneMarker>;

    sceneMarkerDestroy: boolean;

    performerCreate?: Maybe<Performer>;

    performerUpdate?: Maybe<Performer>;

    studioCreate?: Maybe<Studio>;

    studioUpdate?: Maybe<Studio>;

    tagCreate?: Maybe<Tag>;

    tagUpdate?: Maybe<Tag>;

    tagDestroy: boolean;
  }

  export interface Subscription {
    /** Update from the meatadata manager */
    metadataUpdate: string;
  }

  // ====================================================
  // Arguments
  // ====================================================

  export interface FindSceneQueryArgs {
    id?: Maybe<string>;

    checksum?: Maybe<string>;
  }
  export interface FindScenesQueryArgs {
    scene_filter?: Maybe<SceneFilterType>;

    scene_ids?: Maybe<number[]>;

    filter?: Maybe<FindFilterType>;
  }
  export interface FindSceneMarkersQueryArgs {
    scene_marker_filter?: Maybe<SceneMarkerFilterType>;

    filter?: Maybe<FindFilterType>;
  }
  export interface FindPerformerQueryArgs {
    id: string;
  }
  export interface FindPerformersQueryArgs {
    performer_filter?: Maybe<PerformerFilterType>;

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
  export interface FindGalleriesQueryArgs {
    filter?: Maybe<FindFilterType>;
  }
  export interface FindTagQueryArgs {
    id: string;
  }
  export interface MarkerWallQueryArgs {
    q?: Maybe<string>;
  }
  export interface SceneWallQueryArgs {
    q?: Maybe<string>;
  }
  export interface MarkerStringsQueryArgs {
    q?: Maybe<string>;

    sort?: Maybe<string>;
  }
  export interface ValidGalleriesForSceneQueryArgs {
    scene_id?: Maybe<string>;
  }
  export interface SceneMarkerTagsQueryArgs {
    scene_id?: Maybe<string>;
  }
  export interface ScrapeFreeonesQueryArgs {
    performer_name: string;
  }
  export interface ScrapeFreeonesPerformerListQueryArgs {
    query: string;
  }
  export interface SceneUpdateMutationArgs {
    input: SceneUpdateInput;
  }
  export interface SceneMarkerCreateMutationArgs {
    input: SceneMarkerCreateInput;
  }
  export interface SceneMarkerUpdateMutationArgs {
    input: SceneMarkerUpdateInput;
  }
  export interface SceneMarkerDestroyMutationArgs {
    id: string;
  }
  export interface PerformerCreateMutationArgs {
    input: PerformerCreateInput;
  }
  export interface PerformerUpdateMutationArgs {
    input: PerformerUpdateInput;
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
  export interface TagDestroyMutationArgs {
    input: TagDestroyInput;
  }
}
import { GraphQLResolveInfo } from "graphql";

import { Gallery } from "../db/models/gallery.model";

import { Performer } from "../db/models/performer.model";

import { SceneMarker } from "../db/models/scene-marker.model";

import { Scene } from "../db/models/scene.model";

import { Studio } from "../db/models/studio.model";

import { Tag } from "../db/models/tag.model";

import { IGraphQLContext } from "../server";

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** The query root for this schema */
export namespace QueryResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = {}> {
    /** Find a scene by ID or Checksum */
    findScene?: FindSceneResolver<Maybe<Scene>, TypeParent, Context>;
    /** A function which queries Scene objects */
    findScenes?: FindScenesResolver<
      GQL.FindScenesResultType,
      TypeParent,
      Context
    >;
    /** A function which queries SceneMarker objects */
    findSceneMarkers?: FindSceneMarkersResolver<
      GQL.FindSceneMarkersResultType,
      TypeParent,
      Context
    >;
    /** Find a performer by ID */
    findPerformer?: FindPerformerResolver<
      Maybe<Performer>,
      TypeParent,
      Context
    >;
    /** A function which queries Performer objects */
    findPerformers?: FindPerformersResolver<
      GQL.FindPerformersResultType,
      TypeParent,
      Context
    >;
    /** Find a studio by ID */
    findStudio?: FindStudioResolver<Maybe<Studio>, TypeParent, Context>;
    /** A function which queries Studio objects */
    findStudios?: FindStudiosResolver<
      GQL.FindStudiosResultType,
      TypeParent,
      Context
    >;

    findGallery?: FindGalleryResolver<Maybe<Gallery>, TypeParent, Context>;

    findGalleries?: FindGalleriesResolver<
      GQL.FindGalleriesResultType,
      TypeParent,
      Context
    >;

    findTag?: FindTagResolver<Maybe<Tag>, TypeParent, Context>;
    /** Retrieve random scene markers for the wall */
    markerWall?: MarkerWallResolver<SceneMarker[], TypeParent, Context>;
    /** Retrieve random scenes for the wall */
    sceneWall?: SceneWallResolver<Scene[], TypeParent, Context>;
    /** Get marker strings */
    markerStrings?: MarkerStringsResolver<
      (Maybe<GQL.MarkerStringsResultType>)[],
      TypeParent,
      Context
    >;
    /** Get the list of valid galleries for a given scene ID */
    validGalleriesForScene?: ValidGalleriesForSceneResolver<
      Gallery[],
      TypeParent,
      Context
    >;
    /** Get stats */
    stats?: StatsResolver<GQL.StatsResultType, TypeParent, Context>;
    /** Organize scene markers by tag for a given scene ID */
    sceneMarkerTags?: SceneMarkerTagsResolver<
      GQL.SceneMarkerTag[],
      TypeParent,
      Context
    >;
    /** Scrape a performer using Freeones */
    scrapeFreeones?: ScrapeFreeonesResolver<
      Maybe<GQL.ScrapedPerformer>,
      TypeParent,
      Context
    >;
    /** Scrape a list of performers from a query */
    scrapeFreeonesPerformerList?: ScrapeFreeonesPerformerListResolver<
      string[],
      TypeParent,
      Context
    >;
    /** Start an import. Returns the job ID */
    metadataImport?: MetadataImportResolver<string, TypeParent, Context>;
    /** Start an export. Returns the job ID */
    metadataExport?: MetadataExportResolver<string, TypeParent, Context>;
    /** Start a scan. Returns the job ID */
    metadataScan?: MetadataScanResolver<string, TypeParent, Context>;
    /** Start generating content. Returns the job ID */
    metadataGenerate?: MetadataGenerateResolver<string, TypeParent, Context>;
    /** Clean metadata. Returns the job ID */
    metadataClean?: MetadataCleanResolver<string, TypeParent, Context>;

    allPerformers?: AllPerformersResolver<Performer[], TypeParent, Context>;

    allStudios?: AllStudiosResolver<Studio[], TypeParent, Context>;

    allTags?: AllTagsResolver<Tag[], TypeParent, Context>;

    allSceneMarkers?: AllSceneMarkersResolver<
      SceneMarker[],
      TypeParent,
      Context
    >;
  }

  export type FindSceneResolver<
    R = Maybe<Scene>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindSceneArgs>;
  export interface FindSceneArgs {
    id?: Maybe<string>;

    checksum?: Maybe<string>;
  }

  export type FindScenesResolver<
    R = GQL.FindScenesResultType,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindScenesArgs>;
  export interface FindScenesArgs {
    scene_filter?: Maybe<SceneFilterType>;

    scene_ids?: Maybe<number[]>;

    filter?: Maybe<FindFilterType>;
  }

  export type FindSceneMarkersResolver<
    R = GQL.FindSceneMarkersResultType,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindSceneMarkersArgs>;
  export interface FindSceneMarkersArgs {
    scene_marker_filter?: Maybe<SceneMarkerFilterType>;

    filter?: Maybe<FindFilterType>;
  }

  export type FindPerformerResolver<
    R = Maybe<Performer>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindPerformerArgs>;
  export interface FindPerformerArgs {
    id: string;
  }

  export type FindPerformersResolver<
    R = GQL.FindPerformersResultType,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindPerformersArgs>;
  export interface FindPerformersArgs {
    performer_filter?: Maybe<PerformerFilterType>;

    filter?: Maybe<FindFilterType>;
  }

  export type FindStudioResolver<
    R = Maybe<Studio>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindStudioArgs>;
  export interface FindStudioArgs {
    id: string;
  }

  export type FindStudiosResolver<
    R = GQL.FindStudiosResultType,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindStudiosArgs>;
  export interface FindStudiosArgs {
    filter?: Maybe<FindFilterType>;
  }

  export type FindGalleryResolver<
    R = Maybe<Gallery>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindGalleryArgs>;
  export interface FindGalleryArgs {
    id: string;
  }

  export type FindGalleriesResolver<
    R = GQL.FindGalleriesResultType,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindGalleriesArgs>;
  export interface FindGalleriesArgs {
    filter?: Maybe<FindFilterType>;
  }

  export type FindTagResolver<
    R = Maybe<Tag>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindTagArgs>;
  export interface FindTagArgs {
    id: string;
  }

  export type MarkerWallResolver<
    R = SceneMarker[],
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, MarkerWallArgs>;
  export interface MarkerWallArgs {
    q?: Maybe<string>;
  }

  export type SceneWallResolver<
    R = Scene[],
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, SceneWallArgs>;
  export interface SceneWallArgs {
    q?: Maybe<string>;
  }

  export type MarkerStringsResolver<
    R = (Maybe<GQL.MarkerStringsResultType>)[],
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, MarkerStringsArgs>;
  export interface MarkerStringsArgs {
    q?: Maybe<string>;

    sort?: Maybe<string>;
  }

  export type ValidGalleriesForSceneResolver<
    R = Gallery[],
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, ValidGalleriesForSceneArgs>;
  export interface ValidGalleriesForSceneArgs {
    scene_id?: Maybe<string>;
  }

  export type StatsResolver<
    R = GQL.StatsResultType,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneMarkerTagsResolver<
    R = GQL.SceneMarkerTag[],
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, SceneMarkerTagsArgs>;
  export interface SceneMarkerTagsArgs {
    scene_id?: Maybe<string>;
  }

  export type ScrapeFreeonesResolver<
    R = Maybe<GQL.ScrapedPerformer>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, ScrapeFreeonesArgs>;
  export interface ScrapeFreeonesArgs {
    performer_name: string;
  }

  export type ScrapeFreeonesPerformerListResolver<
    R = string[],
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, ScrapeFreeonesPerformerListArgs>;
  export interface ScrapeFreeonesPerformerListArgs {
    query: string;
  }

  export type MetadataImportResolver<
    R = string,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type MetadataExportResolver<
    R = string,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type MetadataScanResolver<
    R = string,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type MetadataGenerateResolver<
    R = string,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type MetadataCleanResolver<
    R = string,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type AllPerformersResolver<
    R = Performer[],
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type AllStudiosResolver<
    R = Studio[],
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type AllTagsResolver<
    R = Tag[],
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type AllSceneMarkersResolver<
    R = SceneMarker[],
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace SceneResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = Scene> {
    id?: IdResolver<string, TypeParent, Context>;

    checksum?: ChecksumResolver<string, TypeParent, Context>;

    title?: TitleResolver<Maybe<string>, TypeParent, Context>;

    details?: DetailsResolver<Maybe<string>, TypeParent, Context>;

    url?: UrlResolver<Maybe<string>, TypeParent, Context>;

    date?: DateResolver<Maybe<string>, TypeParent, Context>;

    rating?: RatingResolver<Maybe<number>, TypeParent, Context>;

    path?: PathResolver<string, TypeParent, Context>;

    file?: FileResolver<GQL.SceneFileType, TypeParent, Context>;

    paths?: PathsResolver<GQL.ScenePathsType, TypeParent, Context>;

    is_streamable?: IsStreamableResolver<boolean, TypeParent, Context>;

    scene_markers?: SceneMarkersResolver<SceneMarker[], TypeParent, Context>;

    gallery?: GalleryResolver<Maybe<Gallery>, TypeParent, Context>;

    studio?: StudioResolver<Maybe<Studio>, TypeParent, Context>;

    tags?: TagsResolver<Tag[], TypeParent, Context>;

    performers?: PerformersResolver<Performer[], TypeParent, Context>;

    scene_marker_tags?: SceneMarkerTagsResolver<
      GQL.SceneMarkerTag[],
      TypeParent,
      Context
    >;
  }

  export type IdResolver<
    R = string,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ChecksumResolver<
    R = string,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TitleResolver<
    R = Maybe<string>,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type DetailsResolver<
    R = Maybe<string>,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type UrlResolver<
    R = Maybe<string>,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type DateResolver<
    R = Maybe<string>,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type RatingResolver<
    R = Maybe<number>,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PathResolver<
    R = string,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type FileResolver<
    R = GQL.SceneFileType,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PathsResolver<
    R = GQL.ScenePathsType,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type IsStreamableResolver<
    R = boolean,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneMarkersResolver<
    R = SceneMarker[],
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type GalleryResolver<
    R = Maybe<Gallery>,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type StudioResolver<
    R = Maybe<Studio>,
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TagsResolver<
    R = Tag[],
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PerformersResolver<
    R = Performer[],
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneMarkerTagsResolver<
    R = GQL.SceneMarkerTag[],
    Parent = Scene,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace SceneFileTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.SceneFileType
  > {
    size?: SizeResolver<Maybe<string>, TypeParent, Context>;

    duration?: DurationResolver<Maybe<number>, TypeParent, Context>;

    video_codec?: VideoCodecResolver<Maybe<string>, TypeParent, Context>;

    audio_codec?: AudioCodecResolver<Maybe<string>, TypeParent, Context>;

    width?: WidthResolver<Maybe<number>, TypeParent, Context>;

    height?: HeightResolver<Maybe<number>, TypeParent, Context>;

    framerate?: FramerateResolver<Maybe<number>, TypeParent, Context>;

    bitrate?: BitrateResolver<Maybe<number>, TypeParent, Context>;
  }

  export type SizeResolver<
    R = Maybe<string>,
    Parent = GQL.SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type DurationResolver<
    R = Maybe<number>,
    Parent = GQL.SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type VideoCodecResolver<
    R = Maybe<string>,
    Parent = GQL.SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type AudioCodecResolver<
    R = Maybe<string>,
    Parent = GQL.SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type WidthResolver<
    R = Maybe<number>,
    Parent = GQL.SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type HeightResolver<
    R = Maybe<number>,
    Parent = GQL.SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type FramerateResolver<
    R = Maybe<number>,
    Parent = GQL.SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type BitrateResolver<
    R = Maybe<number>,
    Parent = GQL.SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace ScenePathsTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.ScenePathsType
  > {
    screenshot?: ScreenshotResolver<Maybe<string>, TypeParent, Context>;

    preview?: PreviewResolver<Maybe<string>, TypeParent, Context>;

    stream?: StreamResolver<Maybe<string>, TypeParent, Context>;

    webp?: WebpResolver<Maybe<string>, TypeParent, Context>;

    vtt?: VttResolver<Maybe<string>, TypeParent, Context>;

    chapters_vtt?: ChaptersVttResolver<Maybe<string>, TypeParent, Context>;
  }

  export type ScreenshotResolver<
    R = Maybe<string>,
    Parent = GQL.ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PreviewResolver<
    R = Maybe<string>,
    Parent = GQL.ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type StreamResolver<
    R = Maybe<string>,
    Parent = GQL.ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type WebpResolver<
    R = Maybe<string>,
    Parent = GQL.ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type VttResolver<
    R = Maybe<string>,
    Parent = GQL.ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ChaptersVttResolver<
    R = Maybe<string>,
    Parent = GQL.ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace SceneMarkerResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = SceneMarker
  > {
    id?: IdResolver<string, TypeParent, Context>;

    scene?: SceneResolver<Scene, TypeParent, Context>;

    title?: TitleResolver<string, TypeParent, Context>;

    seconds?: SecondsResolver<number, TypeParent, Context>;

    primary_tag?: PrimaryTagResolver<Tag, TypeParent, Context>;

    tags?: TagsResolver<Tag[], TypeParent, Context>;
    /** The path to stream this marker */
    stream?: StreamResolver<string, TypeParent, Context>;
    /** The path to the preview image for this marker */
    preview?: PreviewResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = SceneMarker,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneResolver<
    R = Scene,
    Parent = SceneMarker,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TitleResolver<
    R = string,
    Parent = SceneMarker,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SecondsResolver<
    R = number,
    Parent = SceneMarker,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PrimaryTagResolver<
    R = Tag,
    Parent = SceneMarker,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TagsResolver<
    R = Tag[],
    Parent = SceneMarker,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type StreamResolver<
    R = string,
    Parent = SceneMarker,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PreviewResolver<
    R = string,
    Parent = SceneMarker,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace TagResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = Tag> {
    id?: IdResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;

    scene_count?: SceneCountResolver<Maybe<number>, TypeParent, Context>;

    scene_marker_count?: SceneMarkerCountResolver<
      Maybe<number>,
      TypeParent,
      Context
    >;
  }

  export type IdResolver<
    R = string,
    Parent = Tag,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = Tag,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneCountResolver<
    R = Maybe<number>,
    Parent = Tag,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneMarkerCountResolver<
    R = Maybe<number>,
    Parent = Tag,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}
/** Gallery type */
export namespace GalleryResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = Gallery> {
    id?: IdResolver<string, TypeParent, Context>;

    checksum?: ChecksumResolver<string, TypeParent, Context>;

    path?: PathResolver<string, TypeParent, Context>;

    title?: TitleResolver<Maybe<string>, TypeParent, Context>;
    /** The files in the gallery */
    files?: FilesResolver<GQL.GalleryFilesType[], TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Gallery,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ChecksumResolver<
    R = string,
    Parent = Gallery,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PathResolver<
    R = string,
    Parent = Gallery,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TitleResolver<
    R = Maybe<string>,
    Parent = Gallery,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type FilesResolver<
    R = GQL.GalleryFilesType[],
    Parent = Gallery,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace GalleryFilesTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.GalleryFilesType
  > {
    index?: IndexResolver<number, TypeParent, Context>;

    name?: NameResolver<Maybe<string>, TypeParent, Context>;

    path?: PathResolver<Maybe<string>, TypeParent, Context>;
  }

  export type IndexResolver<
    R = number,
    Parent = GQL.GalleryFilesType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = Maybe<string>,
    Parent = GQL.GalleryFilesType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PathResolver<
    R = Maybe<string>,
    Parent = GQL.GalleryFilesType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace StudioResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = Studio> {
    id?: IdResolver<string, TypeParent, Context>;

    checksum?: ChecksumResolver<string, TypeParent, Context>;

    name?: NameResolver<string, TypeParent, Context>;

    url?: UrlResolver<Maybe<string>, TypeParent, Context>;

    image_path?: ImagePathResolver<Maybe<string>, TypeParent, Context>;

    scene_count?: SceneCountResolver<Maybe<number>, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Studio,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ChecksumResolver<
    R = string,
    Parent = Studio,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = string,
    Parent = Studio,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type UrlResolver<
    R = Maybe<string>,
    Parent = Studio,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ImagePathResolver<
    R = Maybe<string>,
    Parent = Studio,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneCountResolver<
    R = Maybe<number>,
    Parent = Studio,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace PerformerResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = Performer
  > {
    id?: IdResolver<string, TypeParent, Context>;

    checksum?: ChecksumResolver<string, TypeParent, Context>;

    name?: NameResolver<Maybe<string>, TypeParent, Context>;

    url?: UrlResolver<Maybe<string>, TypeParent, Context>;

    twitter?: TwitterResolver<Maybe<string>, TypeParent, Context>;

    instagram?: InstagramResolver<Maybe<string>, TypeParent, Context>;

    birthdate?: BirthdateResolver<Maybe<string>, TypeParent, Context>;

    ethnicity?: EthnicityResolver<Maybe<string>, TypeParent, Context>;

    country?: CountryResolver<Maybe<string>, TypeParent, Context>;

    eye_color?: EyeColorResolver<Maybe<string>, TypeParent, Context>;

    height?: HeightResolver<Maybe<string>, TypeParent, Context>;

    measurements?: MeasurementsResolver<Maybe<string>, TypeParent, Context>;

    fake_tits?: FakeTitsResolver<Maybe<string>, TypeParent, Context>;

    career_length?: CareerLengthResolver<Maybe<string>, TypeParent, Context>;

    tattoos?: TattoosResolver<Maybe<string>, TypeParent, Context>;

    piercings?: PiercingsResolver<Maybe<string>, TypeParent, Context>;

    aliases?: AliasesResolver<Maybe<string>, TypeParent, Context>;

    favorite?: FavoriteResolver<boolean, TypeParent, Context>;

    image_path?: ImagePathResolver<Maybe<string>, TypeParent, Context>;

    scene_count?: SceneCountResolver<Maybe<number>, TypeParent, Context>;

    scenes?: ScenesResolver<Scene[], TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ChecksumResolver<
    R = string,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type UrlResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TwitterResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type InstagramResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type BirthdateResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type EthnicityResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type CountryResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type EyeColorResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type HeightResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type MeasurementsResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type FakeTitsResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type CareerLengthResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TattoosResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PiercingsResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type AliasesResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type FavoriteResolver<
    R = boolean,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ImagePathResolver<
    R = Maybe<string>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneCountResolver<
    R = Maybe<number>,
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ScenesResolver<
    R = Scene[],
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace SceneMarkerTagResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.SceneMarkerTag
  > {
    tag?: TagResolver<Tag, TypeParent, Context>;

    scene_markers?: SceneMarkersResolver<SceneMarker[], TypeParent, Context>;
  }

  export type TagResolver<
    R = Tag,
    Parent = GQL.SceneMarkerTag,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneMarkersResolver<
    R = SceneMarker[],
    Parent = GQL.SceneMarkerTag,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace FindScenesResultTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.FindScenesResultType
  > {
    count?: CountResolver<number, TypeParent, Context>;

    scenes?: ScenesResolver<Scene[], TypeParent, Context>;
  }

  export type CountResolver<
    R = number,
    Parent = GQL.FindScenesResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ScenesResolver<
    R = Scene[],
    Parent = GQL.FindScenesResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace FindSceneMarkersResultTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.FindSceneMarkersResultType
  > {
    count?: CountResolver<number, TypeParent, Context>;

    scene_markers?: SceneMarkersResolver<SceneMarker[], TypeParent, Context>;
  }

  export type CountResolver<
    R = number,
    Parent = GQL.FindSceneMarkersResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneMarkersResolver<
    R = SceneMarker[],
    Parent = GQL.FindSceneMarkersResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace FindPerformersResultTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.FindPerformersResultType
  > {
    count?: CountResolver<number, TypeParent, Context>;

    performers?: PerformersResolver<Performer[], TypeParent, Context>;
  }

  export type CountResolver<
    R = number,
    Parent = GQL.FindPerformersResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PerformersResolver<
    R = Performer[],
    Parent = GQL.FindPerformersResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace FindStudiosResultTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.FindStudiosResultType
  > {
    count?: CountResolver<number, TypeParent, Context>;

    studios?: StudiosResolver<Studio[], TypeParent, Context>;
  }

  export type CountResolver<
    R = number,
    Parent = GQL.FindStudiosResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type StudiosResolver<
    R = Studio[],
    Parent = GQL.FindStudiosResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace FindGalleriesResultTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.FindGalleriesResultType
  > {
    count?: CountResolver<number, TypeParent, Context>;

    galleries?: GalleriesResolver<Gallery[], TypeParent, Context>;
  }

  export type CountResolver<
    R = number,
    Parent = GQL.FindGalleriesResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type GalleriesResolver<
    R = Gallery[],
    Parent = GQL.FindGalleriesResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace MarkerStringsResultTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.MarkerStringsResultType
  > {
    count?: CountResolver<number, TypeParent, Context>;

    id?: IdResolver<string, TypeParent, Context>;

    title?: TitleResolver<string, TypeParent, Context>;
  }

  export type CountResolver<
    R = number,
    Parent = GQL.MarkerStringsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type IdResolver<
    R = string,
    Parent = GQL.MarkerStringsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TitleResolver<
    R = string,
    Parent = GQL.MarkerStringsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace StatsResultTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.StatsResultType
  > {
    scene_count?: SceneCountResolver<number, TypeParent, Context>;

    gallery_count?: GalleryCountResolver<number, TypeParent, Context>;

    performer_count?: PerformerCountResolver<number, TypeParent, Context>;

    studio_count?: StudioCountResolver<number, TypeParent, Context>;

    tag_count?: TagCountResolver<number, TypeParent, Context>;
  }

  export type SceneCountResolver<
    R = number,
    Parent = GQL.StatsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type GalleryCountResolver<
    R = number,
    Parent = GQL.StatsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PerformerCountResolver<
    R = number,
    Parent = GQL.StatsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type StudioCountResolver<
    R = number,
    Parent = GQL.StatsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TagCountResolver<
    R = number,
    Parent = GQL.StatsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}
/** A performer from a scraping operation... */
export namespace ScrapedPerformerResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GQL.ScrapedPerformer
  > {
    name?: NameResolver<Maybe<string>, TypeParent, Context>;

    url?: UrlResolver<Maybe<string>, TypeParent, Context>;

    twitter?: TwitterResolver<Maybe<string>, TypeParent, Context>;

    instagram?: InstagramResolver<Maybe<string>, TypeParent, Context>;

    birthdate?: BirthdateResolver<Maybe<string>, TypeParent, Context>;

    ethnicity?: EthnicityResolver<Maybe<string>, TypeParent, Context>;

    country?: CountryResolver<Maybe<string>, TypeParent, Context>;

    eye_color?: EyeColorResolver<Maybe<string>, TypeParent, Context>;

    height?: HeightResolver<Maybe<string>, TypeParent, Context>;

    measurements?: MeasurementsResolver<Maybe<string>, TypeParent, Context>;

    fake_tits?: FakeTitsResolver<Maybe<string>, TypeParent, Context>;

    career_length?: CareerLengthResolver<Maybe<string>, TypeParent, Context>;

    tattoos?: TattoosResolver<Maybe<string>, TypeParent, Context>;

    piercings?: PiercingsResolver<Maybe<string>, TypeParent, Context>;

    aliases?: AliasesResolver<Maybe<string>, TypeParent, Context>;
  }

  export type NameResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type UrlResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TwitterResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type InstagramResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type BirthdateResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type EthnicityResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type CountryResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type EyeColorResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type HeightResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type MeasurementsResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type FakeTitsResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type CareerLengthResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TattoosResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PiercingsResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type AliasesResolver<
    R = Maybe<string>,
    Parent = GQL.ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = {}> {
    sceneUpdate?: SceneUpdateResolver<Maybe<Scene>, TypeParent, Context>;

    sceneMarkerCreate?: SceneMarkerCreateResolver<
      Maybe<SceneMarker>,
      TypeParent,
      Context
    >;

    sceneMarkerUpdate?: SceneMarkerUpdateResolver<
      Maybe<SceneMarker>,
      TypeParent,
      Context
    >;

    sceneMarkerDestroy?: SceneMarkerDestroyResolver<
      boolean,
      TypeParent,
      Context
    >;

    performerCreate?: PerformerCreateResolver<
      Maybe<Performer>,
      TypeParent,
      Context
    >;

    performerUpdate?: PerformerUpdateResolver<
      Maybe<Performer>,
      TypeParent,
      Context
    >;

    studioCreate?: StudioCreateResolver<Maybe<Studio>, TypeParent, Context>;

    studioUpdate?: StudioUpdateResolver<Maybe<Studio>, TypeParent, Context>;

    tagCreate?: TagCreateResolver<Maybe<Tag>, TypeParent, Context>;

    tagUpdate?: TagUpdateResolver<Maybe<Tag>, TypeParent, Context>;

    tagDestroy?: TagDestroyResolver<boolean, TypeParent, Context>;
  }

  export type SceneUpdateResolver<
    R = Maybe<Scene>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, SceneUpdateArgs>;
  export interface SceneUpdateArgs {
    input: SceneUpdateInput;
  }

  export type SceneMarkerCreateResolver<
    R = Maybe<SceneMarker>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, SceneMarkerCreateArgs>;
  export interface SceneMarkerCreateArgs {
    input: SceneMarkerCreateInput;
  }

  export type SceneMarkerUpdateResolver<
    R = Maybe<SceneMarker>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, SceneMarkerUpdateArgs>;
  export interface SceneMarkerUpdateArgs {
    input: SceneMarkerUpdateInput;
  }

  export type SceneMarkerDestroyResolver<
    R = boolean,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, SceneMarkerDestroyArgs>;
  export interface SceneMarkerDestroyArgs {
    id: string;
  }

  export type PerformerCreateResolver<
    R = Maybe<Performer>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, PerformerCreateArgs>;
  export interface PerformerCreateArgs {
    input: PerformerCreateInput;
  }

  export type PerformerUpdateResolver<
    R = Maybe<Performer>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, PerformerUpdateArgs>;
  export interface PerformerUpdateArgs {
    input: PerformerUpdateInput;
  }

  export type StudioCreateResolver<
    R = Maybe<Studio>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, StudioCreateArgs>;
  export interface StudioCreateArgs {
    input: StudioCreateInput;
  }

  export type StudioUpdateResolver<
    R = Maybe<Studio>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, StudioUpdateArgs>;
  export interface StudioUpdateArgs {
    input: StudioUpdateInput;
  }

  export type TagCreateResolver<
    R = Maybe<Tag>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, TagCreateArgs>;
  export interface TagCreateArgs {
    input: TagCreateInput;
  }

  export type TagUpdateResolver<
    R = Maybe<Tag>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, TagUpdateArgs>;
  export interface TagUpdateArgs {
    input: TagUpdateInput;
  }

  export type TagDestroyResolver<
    R = boolean,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, TagDestroyArgs>;
  export interface TagDestroyArgs {
    input: TagDestroyInput;
  }
}

export namespace SubscriptionResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = {}> {
    /** Update from the meatadata manager */
    metadataUpdate?: MetadataUpdateResolver<string, TypeParent, Context>;
  }

  export type MetadataUpdateResolver<
    R = string,
    Parent = {},
    Context = IGraphQLContext
  > = SubscriptionResolver<R, Parent, Context>;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  IGraphQLContext
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  IGraphQLContext
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  IGraphQLContext
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface IResolvers {
  Query?: QueryResolvers.Resolvers;
  Scene?: SceneResolvers.Resolvers;
  SceneFileType?: SceneFileTypeResolvers.Resolvers;
  ScenePathsType?: ScenePathsTypeResolvers.Resolvers;
  SceneMarker?: SceneMarkerResolvers.Resolvers;
  Tag?: TagResolvers.Resolvers;
  Gallery?: GalleryResolvers.Resolvers;
  GalleryFilesType?: GalleryFilesTypeResolvers.Resolvers;
  Studio?: StudioResolvers.Resolvers;
  Performer?: PerformerResolvers.Resolvers;
  SceneMarkerTag?: SceneMarkerTagResolvers.Resolvers;
  FindScenesResultType?: FindScenesResultTypeResolvers.Resolvers;
  FindSceneMarkersResultType?: FindSceneMarkersResultTypeResolvers.Resolvers;
  FindPerformersResultType?: FindPerformersResultTypeResolvers.Resolvers;
  FindStudiosResultType?: FindStudiosResultTypeResolvers.Resolvers;
  FindGalleriesResultType?: FindGalleriesResultTypeResolvers.Resolvers;
  MarkerStringsResultType?: MarkerStringsResultTypeResolvers.Resolvers;
  StatsResultType?: StatsResultTypeResolvers.Resolvers;
  ScrapedPerformer?: ScrapedPerformerResolvers.Resolvers;
  Mutation?: MutationResolvers.Resolvers;
  Subscription?: SubscriptionResolvers.Resolvers;
}

export interface IDirectiveResolvers<Result> {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
