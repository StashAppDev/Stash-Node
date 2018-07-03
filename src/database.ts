import path from 'path';

import { createConnection } from 'typeorm';

import { SceneEntity } from './entities/scene.entity';
import { TagEntity } from './entities/tag.entity';

export const databaseInitializer = async () => {
  const executionDirectory = path.dirname(process.execPath);
  const databasePath = path.join(executionDirectory, 'stash.sqlite');

  return await createConnection({
    type: "sqlite",
    database: databasePath,
    // TODO
    // logging: ["query", "error"],
    // logging: ["error"],
    // maxQueryExecutionTime: 90,
    entities: [
      SceneEntity,
      TagEntity
    ],
    synchronize: true,
  }).then((connection) => {
      console.log('Database connection established');
  });

};