import { ApolloServer } from "apollo-server-express";
import express from "express";
import { IncomingMessage } from "http";
import { databaseInitializer } from "./database";
import { log } from "./logger";
import { resolvers, typeDefs } from "./resolvers";
import scenesRoutes from "./routes/scenes.route";

export interface IStashServerOptions {
  port?: number;
}

export async function run(options: IStashServerOptions) {
  if (!options.port) { options.port = 4000; }

  const app = express();
  app.use("/scenes", scenesRoutes);

  await databaseInitializer();

  const server = new ApolloServer({
    context: (request: IncomingMessage) => ({
      request,
    }),
    resolvers: resolvers as any, // TODO: https://github.com/prisma/graphqlgen/issues/124
    typeDefs,
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
