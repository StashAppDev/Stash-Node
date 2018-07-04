import gql from "graphql-tag";
import { IncomingMessage } from "http";
import path from "path";

import { ApolloServer } from "apollo-server-express";
import express from "express";
import { importSchema } from "graphql-import";

import { GalleryController } from "./controllers/gallery.controller";
import { SceneController } from "./controllers/scene.controller";
import { TagController } from "./controllers/tag.controller";
import { databaseInitializer } from "./database";
import { log } from "./logger";
import { FindScenesQueryArgs } from "./typings/graphql";

//#region Types

export interface IStashServerOptions {
  port?: number;
}

//#endregion

//#region Schema

// NOTE: This path looks weird, but is required for pkg
const schemaPath = path.join(__dirname, "../src/schema.graphql");
const schemaString = importSchema(schemaPath);
const schema = gql`
  ${schemaString}
`;

const resolvers = {
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
      return SceneController.findScenes(args);
    },
  },
};

//#endregion

export async function run(options: IStashServerOptions) {
  if (!options.port) { options.port = 4000; }

  const app = express();

  app.get("/scenes/:id/stream", (req, res) => {
    SceneController.stream(req, res);
  });

  app.get("/scenes/:id/screenshot", (req, res) => {
    SceneController.screenshot(req, res);
  });

  await databaseInitializer();

  const server = new ApolloServer({
    context: (request: IncomingMessage) => ({
      request,
    }),
    resolvers,
    typeDefs: schema,
  });
  const serverPath = "/graphql";

  server.applyMiddleware({ app, path: serverPath });

  app.listen({ port: options.port }, () => {
    log.info(`🚀 Server ready at http://localhost:${options.port}${server.graphqlPath}`);
  });

}

// // NOTE: For debugging the pkg container...
// function walkSync(dir: string): string {
//   if (!fs.lstatSync(dir).isDirectory()) return dir;
//   return fs.readdirSync(dir).map(f => walkSync(path.join(dir, f))).join('\n');
// }
// console.log(walkSync(path.join(__dirname, '../')))
