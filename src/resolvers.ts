import { importSchema } from "graphql-import";
import gql from "graphql-tag";
import path from "path";
import { URL } from "url";
import { GalleryController } from "./controllers/gallery.controller";
import { SceneController } from "./controllers/scene.controller";
import { StudioController } from "./controllers/studio.controller";
import { TagController } from "./controllers/tag.controller";
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
    findScenes(root, args, context, info): GQL.FindScenesResultType {
      return SceneController.findScenes(root, args, context, info);
    },
    findStudio(root, args, context, info): GQL.Studio {
      return StudioController.findStudio(root, args, context, info);
    },
    stats(root, args, context, info): GQL.StatsResultType {
      return { scene_count: 100, gallery_count: 0, performer_count: 0, studio_count: 0, tag_count: 4 };
    },
  },
  Scene: {
    file(root, args, context, info): GQL.SceneFileType {
      return {
        audio_codec: root.audioCodec,
        duration: root.duration,
        height: root.height,
        size: root.size,
        video_codec: root.videoCodec,
        width: root.width,
      };
    },
    paths(root, args, context, info): GQL.ScenePathsType {
      return {
        // TODO
        screenshot: new URL(`/scenes/${root.id}/screenshot`, context.baseUrl).toString(),
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
