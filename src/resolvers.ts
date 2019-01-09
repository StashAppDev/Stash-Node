import { importSchema } from "graphql-import";
import gql from "graphql-tag";
import path from "path";
import { URL } from "url";
import { GalleryController } from "./controllers/gallery.controller";
import { SceneMarkerController } from "./controllers/scene-marker.controller";
import { SceneController } from "./controllers/scene.controller";
import { StudioController } from "./controllers/studio.controller";
import { TagController } from "./controllers/tag.controller";
import { Database } from "./db/database";
import { GQL, IResolvers } from "./typings/graphql";

// NOTE: This path looks weird, but is required for pkg
const schemaPath = path.join(__dirname, "../src/schema.graphql");
const schemaString = importSchema(schemaPath);
export const typeDefs = gql`
  ${schemaString}
`;

export const resolvers: IResolvers = {
  Gallery: {
    files(root, args, context, info): GQL.GalleryFilesType[] {
      // TODO: Find files for given root id
      // GalleryController.find(root.id);
      return [];
    },
  },
  Mutation: {
    studioCreate(root, args, context, info): GQL.Studio {
      return StudioController.studioCreate(root, args, context, info);
    },
    studioUpdate(root, args, context, info): GQL.Studio {
      return StudioController.studioUpdate(root, args, context, info);
    },
    tagCreate(root, args, context, info): GQL.Tag {
      return TagController.tagCreate(root, args, context, info);
    },
    tagUpdate(root, args, context, info): GQL.Tag {
      return TagController.tagUpdate(root, args, context, info);
    },
  },
  Query: {
    findGallery(root, args, context, info): GQL.Gallery {
      return GalleryController.findGallery(root, args, context, info);
    },
    findTag(root, args, context, info): GQL.Tag {
      return TagController.findTag(root, args, context, info);
    },
    findScene(root, args, context, info): GQL.Scene {
      return SceneController.findScene(root, args, context, info);
    },
    findScenes(root, args, context, info): GQL.FindScenesResultType {
      return SceneController.findScenes(root, args, context, info);
    },
    findStudio(root, args, context, info): GQL.Studio {
      return StudioController.findStudio(root, args, context, info);
    },
    sceneMarkerTags(root, args, context, info)/*: QueryResolvers.SceneMarkerTagsResolver<any>*/ {
      return SceneMarkerController.sceneMarkerTags(root, args, context, info);
    },
    async stats(root, args, context, info): Promise<GQL.StatsResultType> {
      // tslint:disable:variable-name
      const scene_count = await Database.Scene.count();
      const gallery_count = await Database.Gallery.count();
      const performer_count = await Database.Performer.count();
      const studio_count = await Database.Studio.count();
      const tag_count = await Database.Tag.count();
      return { scene_count, gallery_count, performer_count, studio_count, tag_count };
      // tslint:enable:variable-name
    },
  },
  Scene: {
    file(root, args, context, info): GQL.SceneFileType {
      return {
        audio_codec: root.audioCodec,
        bitrate: root.bitrate,
        duration: root.duration,
        framerate: root.framerate,
        height: root.height,
        size: root.size,
        video_codec: root.videoCodec,
        width: root.width,
      };
    },
    paths(root, args, context, info): GQL.ScenePathsType {
      return {
        // TODO:  Get these paths from the resolver?
        preview: new URL(`/scenes/${root.id}/preview`, context.baseUrl).toString(),
        screenshot: new URL(`/scenes/${root.id}/screenshot`, context.baseUrl).toString(),
        stream: new URL(`/scenes/${root.id}/stream.mp4`, context.baseUrl).toString(),
        webp: new URL(`/scenes/${root.id}/webp`, context.baseUrl).toString(),
      };
    },
    is_streamable(root, args, context, info): boolean {
      return true; // TODO
    },

    // TODO: remove these.  Don't need these resolvers
    scene_markers(): GQL.SceneMarker[] { return []; },
    tags(): GQL.Tag[] { return []; },
    performers(): GQL.Performer[] { return []; },
  },
};
