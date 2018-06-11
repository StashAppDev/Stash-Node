import express from 'express';
import bodyParser from 'body-parser';
import gql from 'graphql-tag';
import { IncomingMessage } from 'http';

import { ApolloServer } from 'apollo-server';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { importSchema } from 'graphql-import';

import { databaseInitializer } from './database';
import { GalleryController } from './controllers/gallery.controller';
import { TagController } from './controllers/tag.controller';

//region Types

export type StashRunOptions = {
  port?: number;
}

//endregion

//region Schema

const schemaString = importSchema('./src/schema.graphql');
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

//endregion

export async function run(options: StashRunOptions) {
  if (!options.port) { options.port = 4000; }

  await databaseInitializer();

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers,
    context: (request: IncomingMessage) => ({
      request
    })
  });

  server.listen({http: {port: options.port}}).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  });

}
