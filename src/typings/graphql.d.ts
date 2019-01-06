/* tslint:disable */
// Generated in 2019-01-06T01:44:55-08:00
export type Maybe<T> = T | undefined;

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
export namespace GQL {
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
}
import { GraphQLResolveInfo } from "graphql";

import { SceneEntity } from "../entities/scene.entity";

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

export namespace QueryResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = {}> {
    findScenes?: FindScenesResolver<FindScenesResultType, TypeParent, Context>;

    findStudio?: FindStudioResolver<Maybe<Studio>, TypeParent, Context>;

    findStudios?: FindStudiosResolver<
      FindStudiosResultType,
      TypeParent,
      Context
    >;

    findGallery?: FindGalleryResolver<Maybe<Gallery>, TypeParent, Context>;

    findTag?: FindTagResolver<Maybe<Tag>, TypeParent, Context>;

    stats?: StatsResolver<StatsResultType, TypeParent, Context>;
  }

  export type FindScenesResolver<
    R = FindScenesResultType,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindScenesArgs>;
  export interface FindScenesArgs {
    scene_filter?: Maybe<SceneFilterType>;

    scene_ids?: Maybe<(Maybe<number>)[]>;

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
    R = FindStudiosResultType,
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

  export type FindTagResolver<
    R = Maybe<Tag>,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context, FindTagArgs>;
  export interface FindTagArgs {
    id: string;
  }

  export type StatsResolver<
    R = StatsResultType,
    Parent = {},
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace FindScenesResultTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = FindScenesResultType
  > {
    count?: CountResolver<number, TypeParent, Context>;

    scenes?: ScenesResolver<(Maybe<SceneEntity>)[], TypeParent, Context>;
  }

  export type CountResolver<
    R = number,
    Parent = FindScenesResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ScenesResolver<
    R = (Maybe<SceneEntity>)[],
    Parent = FindScenesResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace SceneResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = SceneEntity
  > {
    id?: IdResolver<string, TypeParent, Context>;

    checksum?: ChecksumResolver<string, TypeParent, Context>;

    title?: TitleResolver<Maybe<string>, TypeParent, Context>;

    details?: DetailsResolver<Maybe<string>, TypeParent, Context>;

    url?: UrlResolver<Maybe<string>, TypeParent, Context>;

    date?: DateResolver<Maybe<string>, TypeParent, Context>;

    rating?: RatingResolver<Maybe<number>, TypeParent, Context>;

    path?: PathResolver<string, TypeParent, Context>;

    file?: FileResolver<SceneFileType, TypeParent, Context>;

    paths?: PathsResolver<ScenePathsType, TypeParent, Context>;

    is_streamable?: IsStreamableResolver<boolean, TypeParent, Context>;

    scene_markers?: SceneMarkersResolver<
      (Maybe<SceneMarker>)[],
      TypeParent,
      Context
    >;

    gallery?: GalleryResolver<Maybe<Gallery>, TypeParent, Context>;

    studio?: StudioResolver<Maybe<Studio>, TypeParent, Context>;

    tags?: TagsResolver<(Maybe<Tag>)[], TypeParent, Context>;

    performers?: PerformersResolver<(Maybe<Performer>)[], TypeParent, Context>;

    scene_marker_tags?: SceneMarkerTagsResolver<
      (Maybe<SceneMarkerTag>)[],
      TypeParent,
      Context
    >;
  }

  export type IdResolver<
    R = string,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ChecksumResolver<
    R = string,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TitleResolver<
    R = Maybe<string>,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type DetailsResolver<
    R = Maybe<string>,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type UrlResolver<
    R = Maybe<string>,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type DateResolver<
    R = Maybe<string>,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type RatingResolver<
    R = Maybe<number>,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PathResolver<
    R = string,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type FileResolver<
    R = SceneFileType,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PathsResolver<
    R = ScenePathsType,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type IsStreamableResolver<
    R = boolean,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneMarkersResolver<
    R = (Maybe<SceneMarker>)[],
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type GalleryResolver<
    R = Maybe<Gallery>,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type StudioResolver<
    R = Maybe<Studio>,
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TagsResolver<
    R = (Maybe<Tag>)[],
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PerformersResolver<
    R = (Maybe<Performer>)[],
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneMarkerTagsResolver<
    R = (Maybe<SceneMarkerTag>)[],
    Parent = SceneEntity,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace SceneFileTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = SceneFileType
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
    Parent = SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type DurationResolver<
    R = Maybe<number>,
    Parent = SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type VideoCodecResolver<
    R = Maybe<string>,
    Parent = SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type AudioCodecResolver<
    R = Maybe<string>,
    Parent = SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type WidthResolver<
    R = Maybe<number>,
    Parent = SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type HeightResolver<
    R = Maybe<number>,
    Parent = SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type FramerateResolver<
    R = Maybe<number>,
    Parent = SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type BitrateResolver<
    R = Maybe<number>,
    Parent = SceneFileType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace ScenePathsTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = ScenePathsType
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
    Parent = ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PreviewResolver<
    R = Maybe<string>,
    Parent = ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type StreamResolver<
    R = Maybe<string>,
    Parent = ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type WebpResolver<
    R = Maybe<string>,
    Parent = ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type VttResolver<
    R = Maybe<string>,
    Parent = ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type ChaptersVttResolver<
    R = Maybe<string>,
    Parent = ScenePathsType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace SceneMarkerResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = SceneMarker
  > {
    id?: IdResolver<string, TypeParent, Context>;

    scene?: SceneResolver<SceneEntity, TypeParent, Context>;

    title?: TitleResolver<string, TypeParent, Context>;

    seconds?: SecondsResolver<number, TypeParent, Context>;

    primary_tag?: PrimaryTagResolver<Tag, TypeParent, Context>;

    tags?: TagsResolver<(Maybe<Tag>)[], TypeParent, Context>;

    stream?: StreamResolver<string, TypeParent, Context>;

    preview?: PreviewResolver<string, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = SceneMarker,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneResolver<
    R = SceneEntity,
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
    R = (Maybe<Tag>)[],
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
    files?: FilesResolver<(Maybe<GalleryFilesType>)[], TypeParent, Context>;
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
    R = (Maybe<GalleryFilesType>)[],
    Parent = Gallery,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace GalleryFilesTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = GalleryFilesType
  > {
    index?: IndexResolver<number, TypeParent, Context>;

    name?: NameResolver<Maybe<string>, TypeParent, Context>;

    path?: PathResolver<Maybe<string>, TypeParent, Context>;
  }

  export type IndexResolver<
    R = number,
    Parent = GalleryFilesType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = Maybe<string>,
    Parent = GalleryFilesType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PathResolver<
    R = Maybe<string>,
    Parent = GalleryFilesType,
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

    scenes?: ScenesResolver<(Maybe<SceneEntity>)[], TypeParent, Context>;
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
    R = (Maybe<SceneEntity>)[],
    Parent = Performer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace SceneMarkerTagResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = SceneMarkerTag
  > {
    tag?: TagResolver<Maybe<Tag>, TypeParent, Context>;

    scene_markers?: SceneMarkersResolver<
      (Maybe<SceneMarker>)[],
      TypeParent,
      Context
    >;
  }

  export type TagResolver<
    R = Maybe<Tag>,
    Parent = SceneMarkerTag,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type SceneMarkersResolver<
    R = (Maybe<SceneMarker>)[],
    Parent = SceneMarkerTag,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace FindStudiosResultTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = FindStudiosResultType
  > {
    count?: CountResolver<number, TypeParent, Context>;

    studios?: StudiosResolver<(Maybe<Studio>)[], TypeParent, Context>;
  }

  export type CountResolver<
    R = number,
    Parent = FindStudiosResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type StudiosResolver<
    R = (Maybe<Studio>)[],
    Parent = FindStudiosResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace StatsResultTypeResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = StatsResultType
  > {
    scene_count?: SceneCountResolver<number, TypeParent, Context>;

    gallery_count?: GalleryCountResolver<number, TypeParent, Context>;

    performer_count?: PerformerCountResolver<number, TypeParent, Context>;

    studio_count?: StudioCountResolver<number, TypeParent, Context>;

    tag_count?: TagCountResolver<number, TypeParent, Context>;
  }

  export type SceneCountResolver<
    R = number,
    Parent = StatsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type GalleryCountResolver<
    R = number,
    Parent = StatsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PerformerCountResolver<
    R = number,
    Parent = StatsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type StudioCountResolver<
    R = number,
    Parent = StatsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TagCountResolver<
    R = number,
    Parent = StatsResultType,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = IGraphQLContext, TypeParent = {}> {
    studioCreate?: StudioCreateResolver<Maybe<Studio>, TypeParent, Context>;

    studioUpdate?: StudioUpdateResolver<Maybe<Studio>, TypeParent, Context>;

    tagCreate?: TagCreateResolver<Maybe<Tag>, TypeParent, Context>;

    tagUpdate?: TagUpdateResolver<Maybe<Tag>, TypeParent, Context>;
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
}
/** A performer from a scraping operation... */
export namespace ScrapedPerformerResolvers {
  export interface Resolvers<
    Context = IGraphQLContext,
    TypeParent = ScrapedPerformer
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
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type UrlResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TwitterResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type InstagramResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type BirthdateResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type EthnicityResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type CountryResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type EyeColorResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type HeightResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type MeasurementsResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type FakeTitsResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type CareerLengthResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type TattoosResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type PiercingsResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
  export type AliasesResolver<
    R = Maybe<string>,
    Parent = ScrapedPerformer,
    Context = IGraphQLContext
  > = Resolver<R, Parent, Context>;
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
  FindScenesResultType?: FindScenesResultTypeResolvers.Resolvers;
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
  FindStudiosResultType?: FindStudiosResultTypeResolvers.Resolvers;
  StatsResultType?: StatsResultTypeResolvers.Resolvers;
  Mutation?: MutationResolvers.Resolvers;
  ScrapedPerformer?: ScrapedPerformerResolvers.Resolvers;
}

export interface IDirectiveResolvers<Result> {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
