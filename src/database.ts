import { Sequelize } from "sequelize-typescript";
import { log } from "./logger";
import { StashPaths } from "./stash/paths.stash";

class DatabaseImpl {
  public sequelize: Sequelize;

  public async initialize() {
    this.sequelize = new Sequelize({
      database: "stash",
      define: {
        timestamps: true,
        underscored: true,
      },
      dialect: "sqlite",
      logging: false,
      modelMatch: (filename, member) => {
        return filename.substring(0, filename.indexOf(".model")) === member.toLowerCase();
      },
      modelPaths: [
        __dirname + "/models/**/*.model.ts",
        __dirname + "/models/**/*.model.js",
      ],
      password: "",
      storage: StashPaths.databaseFile,
      // storage: ":memory:",
      username: "root",
    });
    this.sequelize.sync({force: false});
    await this.sequelize.authenticate().then(() => {
      log.info("Database connection established");
    });
  }
}

export const Database = new DatabaseImpl();
