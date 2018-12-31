import { createConnection } from "typeorm";

import { SceneEntity } from "./entities/scene.entity";
import { StudioEntity } from "./entities/studio.entity";
import { TagEntity } from "./entities/tag.entity";
import { log } from "./logger";
import { StashPaths } from "./stash/paths.stash";

export const databaseInitializer = async () => {
  return await createConnection({
    database: StashPaths.databaseFile,
    entities: [
      SceneEntity,
      StudioEntity,
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
