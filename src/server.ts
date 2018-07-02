import path from 'path';
import fs from 'fs';
import gql from 'graphql-tag';
import { IncomingMessage } from 'http';

import express from 'express';
import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';

import { databaseInitializer } from './database';
import { GalleryController } from './controllers/gallery.controller';
import { TagController } from './controllers/tag.controller';
import { SceneController } from './controllers/scene.controller';
import { FindScenesQueryArgs } from './typings/graphql';

//#region Types

export type StashServerOptions = {
  port?: number;
};

//#endregion

//#region Schema

// NOTE: This path looks weird, but is required for pkg
const schemaPath = path.join(__dirname, '../src/schema.graphql');
const schemaString = importSchema(schemaPath);
const schema = gql`
  ${schemaString}
`;

const resolvers = {
  Query: {
    findGallery(root: any, args: any, context: any) {
      return {id: '1'};
    },
    findTag(root: any, args: any, context: any) {
      return TagController.find(args.id);
    },
    findScenes(root: any, args: FindScenesQueryArgs, context: any) {
      return SceneController.findScenes(args);
    }
  },
  Mutation: {
    tagCreate(root: any, args: any, context: any) {
      return TagController.create(args.input);
    }
  },
  Gallery: {
    files(root: any, args: any, context: any) {
      // TODO: Find files for given root id
      // GalleryController.find(root.id);
    }
  }
};

//#endregion

export async function run(options: StashServerOptions) {
  if (!options.port) { options.port = 4000; }

  const app = express();

  await databaseInitializer();

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    context: (request: IncomingMessage) => ({
      request
    })
  });
  const serverPath = '/graphql';

  server.applyMiddleware({ app, path: serverPath });

  server.listen({ port: options.port }, () => {
    console.log(`🚀 Server ready at http://localhost:${options.port}${server.graphqlPath}`)
  });

}

// // NOTE: For debugging the pkg container...
// function walkSync(dir: string): string {
//   if (!fs.lstatSync(dir).isDirectory()) return dir;
//   return fs.readdirSync(dir).map(f => walkSync(path.join(dir, f))).join('\n');
// }
// console.log(walkSync(path.join(__dirname, '../')))
