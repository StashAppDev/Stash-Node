import path from "path";

import { createConnection } from "typeorm";

import { SceneEntity } from "./entities/scene.entity";
import { TagEntity } from "./entities/tag.entity";
import { log } from "./logger";

export const databaseInitializer = async () => {
  const executionDirectory = path.dirname(process.execPath);
  const databasePath = path.join(executionDirectory, "stash.sqlite");

  return await createConnection({
    database: databasePath,
    entities: [
      SceneEntity,
      TagEntity,
    ],
    synchronize: true,
    type: "sqlite",
    // TODO
    // logging: ["query", "error"],
    // logging: ["error"],
    // maxQueryExecutionTime: 90,
  }).then((connection) => {
      log.info("Database connection established");
  });

};
