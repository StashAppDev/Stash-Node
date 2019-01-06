import Sequelize from "sequelize";
import { log } from "../logger";
import { StashPaths } from "../stash/paths.stash";
import { ISceneAttributes, ISceneInstance, SceneFactory } from "./models/scene.model";
import { IStudioAttributes, IStudioInstance, StudioFactory } from "./models/studio.model";
import { ITagAttributes, ITagInstance, TagFactory } from "./models/tag.model";

class DatabaseImpl {
  public sequelize: Sequelize.Sequelize;
  public Sequelize: Sequelize.SequelizeStatic;

  public Studio: Sequelize.Model<IStudioInstance, IStudioAttributes>;
  public Scene: Sequelize.Model<ISceneInstance, ISceneAttributes>;
  public Tag: Sequelize.Model<ITagInstance, ITagAttributes>;

  public async initialize() {
    // Sequelize
    this.Sequelize = Sequelize;
    this.sequelize = new Sequelize({
      database: "stash",
      define: {
        timestamps: true,
        underscored: true,
      },
      dialect: "sqlite",
      logging: false,
      password: "",
      storage: StashPaths.databaseFile,
      // storage: ":memory:",
      username: "root",
    });

    // Models
    this.Scene = SceneFactory(this.sequelize, this.Sequelize);
    this.Studio = StudioFactory(this.sequelize, this.Sequelize);
    this.Tag = TagFactory(this.sequelize, this.Sequelize);

    // Model associations
    Object.keys(this.sequelize.models).forEach((modelName) => {
      const model = this.sequelize.models[modelName];
      if (!!model.associate) {
        model.associate(this.sequelize.models);
      }
    });

    // Sync
    this.sequelize.sync({force: false});

    await this.sequelize.authenticate().then(() => {
      log.info("Database connection established");
    });
  }
}

export const Database = new DatabaseImpl();
