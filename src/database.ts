import { createConnection } from 'typeorm';
import { Scene } from 'entities/scene';

export const databaseInitializer = async () => {

  return await createConnection({
    type: "sqlite",
    database: "database.db",
    logging: ["query", "error"],
    maxQueryExecutionTime: 90,
    entities: [
      Scene,
    ],
    synchronize: true,
  }).then((connection) => {
      console.log('Database connection established');
  });

};