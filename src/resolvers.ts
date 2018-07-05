import { importSchema } from "graphql-import";
import gql from "graphql-tag";
import path from "path";
import { GalleryController } from "./controllers/gallery.controller";
import { SceneController } from "./controllers/scene.controller";
import { StudioController } from "./controllers/studio.controller";
import { TagController } from "./controllers/tag.controller";
import { SceneEntity } from "./entities/scene.entity";
import {
  FindScenesQueryArgs,
  SceneFileType,
  ScenePathsType,
  StudioCreateMutationArgs,
  StudioUpdateMutationArgs,
  TagCreateMutationArgs,
  TagUpdateMutationArgs,
} from "./typings/graphql";

// NOTE: This path looks weird, but is required for pkg
const schemaPath = path.join(__dirname, "../src/schema.graphql");
const schemaString = importSchema(schemaPath);
export const typeDefs = gql`
  ${schemaString}
`;

export const resolvers = {
  Gallery: {
    files(root: any, args: any, context: any) {
      // TODO: Find files for given root id
      // GalleryController.find(root.id);
    },
  },
  Mutation: {
    studioCreate(root: any, args: StudioCreateMutationArgs, context: any) {
      return StudioController.create(args.input);
    },
    studioUpdate(root: any, args: StudioUpdateMutationArgs, context: any) {
      return StudioController.update(args.input);
    },
    tagCreate(root: any, args: TagCreateMutationArgs, context: any) {
      return TagController.create(args.input);
    },
    tagUpdate(root: any, args: TagUpdateMutationArgs, context: any) {
      return TagController.update(args.input);
    },
  },
  Query: {
    findGallery(root: any, args: any, context: any) {
      return {id: "1"};
    },
    findTag(root: any, args: any, context: any) {
      return TagController.find(args.id);
    },
    findScenes(root: any, args: FindScenesQueryArgs, context: any) {
      return SceneController.findScenes(root, args, context);
    },
  },
  Scene: {
    file(root: SceneEntity, args: any, context: any): SceneFileType {
      return {
        audio_codec: root.audioCodec,
        duration: root.duration,
        height: root.height,
        size: root.size,
        video_codec: root.videoCodec,
        width: root.width,
      };
    },
    paths(root: SceneEntity, args: any, context: any): ScenePathsType {
      return {
        // TODO
      };
    },
    is_streamable(root: SceneEntity, args: any, context: any): boolean {
      return true; // TODO
    },
  },
};
