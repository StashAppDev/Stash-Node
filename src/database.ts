import path from 'path';

import { createConnection } from 'typeorm';

import { Scene } from './entities/scene';
import { Tag } from './entities/tag';

export const databaseInitializer = async () => {
  const executionDirectory = path.dirname(process.execPath);
  const databasePath = path.join(executionDirectory, 'stash.sqlite');

  return await createConnection({
    type: "sqlite",
    database: databasePath,
    logging: ["query", "error"],
    maxQueryExecutionTime: 90,
    entities: [
      Scene,
      Tag
    ],
    synchronize: true,
  }).then((connection) => {
      console.log('Database connection established');
  });

};