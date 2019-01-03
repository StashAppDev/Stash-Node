import { ApolloServer } from "apollo-server-express";
import express from "express";
import path from "path";
import { URL } from "url";
import { databaseInitializer } from "./database";
import { HttpError } from "./errors/http.error";
import { log } from "./logger";
import { resolvers, typeDefs } from "./resolvers";
import sceneRoutes from "./routes/scene.route";
import studioRoutes from "./routes/studio.route";

export interface IStashServerOptions {
  port?: number;
}

export interface IGraphQLContext {
  req: express.Request;
  res: express.Response;
  baseUrl: URL;
}

export async function run(options: IStashServerOptions) {
  if (!options.port) { options.port = 4000; }

  const app = express();
  app.use("/scenes", sceneRoutes);
  app.use("/studios", studioRoutes);
  app.use(express.static(path.join(__dirname, "../dist-ui")));
  app.use("*", express.static(path.join(__dirname, "../dist-ui/index.html")));

  // Error handling
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }
    const code = err instanceof HttpError ? err.code : 500;
    const message =
      err instanceof HttpError ? err.message : `Internal Server Error<br/><br/>${err.message}<br/><br/>${err.stack}`;
    return res.status(code).send(message);
  });

  await databaseInitializer();

  const server = new ApolloServer({
    context: (msg: {req: express.Request, res: express.Response}): IGraphQLContext => ({
      baseUrl: new URL(`${msg.req.protocol}://${msg.req.get("host")}`),
      req: msg.req,
      res: msg.res,
    }),
    resolvers: resolvers as any, // TODO: https://github.com/prisma/graphqlgen/issues/124
    typeDefs,
  });
  const serverPath = "/graphql";

  server.applyMiddleware({ app, path: serverPath });

  app.listen({ port: options.port }, () => {
    log.info(`Server ready at http://localhost:${options.port}`);
  });
}

// // NOTE: For debugging the pkg container...
// function walkSync(dir: string): string {
//   if (!fs.lstatSync(dir).isDirectory()) { return dir; }
//   return fs.readdirSync(dir).map((f: any) => walkSync(path.join(dir, f))).join("\n");
// }
// log.info(walkSync(path.join(__dirname, "../")));
