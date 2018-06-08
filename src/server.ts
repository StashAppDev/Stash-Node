import express from 'express';
import bodyParser from 'body-parser';
import gql from 'graphql-tag';

import { ApolloServer } from 'apollo-server';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { importSchema } from 'graphql-import';

import { databaseInitializer } from './database';
import { GalleryController } from './controllers/gallery.controller';

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
    }
  },
  Gallery: {
    files(root: any, args: any, context: any) {
      GalleryController.find(root.id);
    }
  }
};

//endregion

export async function run(options: StashRunOptions) {
  if (!options.port) { options.port = 3000; }

  await databaseInitializer();

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  });

}

// const bootstrap = async () => {
//   await databaseInitializer();
//
//   // const myGraphQLSchema = // ... define or import your schema here!
//   const app = express();
//
// // bodyParser is needed just for POST.
// // app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: myGraphQLSchema }));
//   // app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: './schema.graphql' }));
//   app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled
//
//   app.listen(PORT);
// }
//
// bootstrap();

// const server = new ApolloServer({
//   typeDefs: schema,
//   resolvers: resolvers
// });

// new ApolloServer({
//   typeDefs,
//   resolvers,
//   // context: ({ req }) => ({
//   //   authScope: getScope(req.headers.authorization)
//   // }),
// });

// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`)
// });