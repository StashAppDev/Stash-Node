import { importSchema } from "graphql-import";
import gql from "graphql-tag";
import path from "path";
import { GalleryController } from "./controllers/gallery.controller";
import { SceneController } from "./controllers/scene.controller";
import { TagController } from "./controllers/tag.controller";
import { FindScenesQueryArgs } from "./typings/graphql";

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
    tagCreate(root: any, args: any, context: any) {
      return TagController.create(args.input);
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
};
