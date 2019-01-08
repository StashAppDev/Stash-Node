import Sequelize from "sequelize";
import { log } from "../logger";
import { StashPaths } from "../stash/paths.stash";
import { GalleryFactory, IGalleryAttributes, IGalleryInstance } from "./models/gallery.model";
import { IPerformerAttributes, IPerformerInstance, PerformerFactory } from "./models/performer.model";
import { ISceneMarkerAttributes, ISceneMarkerInstance, SceneMarkerFactory } from "./models/scene-markers.model";
import { AddSceneScopes, ISceneAttributes, ISceneInstance, SceneFactory } from "./models/scene.model";
import { IScrapedItemAttributes, IScrapedItemInstance, ScrapedItemFactory } from "./models/scraped-item";
import { IStudioAttributes, IStudioInstance, StudioFactory } from "./models/studio.model";
import { ITagAttributes, ITagInstance, TagFactory } from "./models/tag.model";

class DatabaseImpl {
  public sequelize: Sequelize.Sequelize;
  public Sequelize: Sequelize.SequelizeStatic;

  public Gallery: Sequelize.Model<IGalleryInstance, IGalleryAttributes>;
  public Performer: Sequelize.Model<IPerformerInstance, IPerformerAttributes>;
  public Scene: Sequelize.Model<ISceneInstance, ISceneAttributes>;
  public SceneMarker: Sequelize.Model<ISceneMarkerInstance, ISceneMarkerAttributes>;
  public ScrapedItem: Sequelize.Model<IScrapedItemInstance, IScrapedItemAttributes>;
  public Studio: Sequelize.Model<IStudioInstance, IStudioAttributes>;
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
    this.Gallery = GalleryFactory(this.sequelize, this.Sequelize);
    this.Performer = PerformerFactory(this.sequelize, this.Sequelize);
    this.Scene = SceneFactory(this.sequelize, this.Sequelize);
    this.SceneMarker = SceneMarkerFactory(this.sequelize, this.Sequelize);
    this.ScrapedItem = ScrapedItemFactory(this.sequelize, this.Sequelize);
    this.Studio = StudioFactory(this.sequelize, this.Sequelize);
    this.Tag = TagFactory(this.sequelize, this.Sequelize);

    AddSceneScopes();

    // TODO: Only do this if db is clear
    // this.addIndexes();

    // Model associations
    Object.keys(this.sequelize.models).forEach((modelName) => {
      const model = this.sequelize.models[modelName];
      if (!!model.associate) {
        model.associate(this.sequelize.models);
      }
    });

    // Sync
    // this.sequelize.sync({force: false});

    await this.sequelize.authenticate().then(() => {
      log.info("Database connection established");
    });
  }

  public async reset() {
    const qi = this.sequelize.getQueryInterface();
    await qi.dropAllTables();
    await this.sequelize.sync({ force: true });
    // const sql = fs.readFileSync(__dirname + "/development.sql", "utf8");
    // await this.sequelize.query(sql, { raw: true });
    // sequelize.query('SELECT...').spread((results, metadata) => {
    //   // Raw query - use spread
    // });
  }

  private async addIndexes() {
    // TODO: Instead of sync manually create and migrate database via query interface.  Save a DB version.
    const qi = this.sequelize.getQueryInterface();
    await qi.addIndex("scenes_tags", ["scene_id"], { indexName: "index_scenes_tags_on_scene_id" });
    await qi.addIndex("scenes_tags", ["tag_id"], { indexName: "index_scenes_tags_on_tag_id" });
    await qi.addIndex("performers_scenes", ["scene_id"], { indexName: "index_scenes_tags_on_scene_id" });
    await qi.addIndex("performers_scenes", ["performer_id"], { indexName: "index_performers_scenes_on_performer_id" });
    await qi.addIndex("scene_markers_tags", ["scene_marker_id"], {
      indexName: "index_scene_markers_tags_on_scene_marker_id",
    });
    await qi.addIndex("scene_markers_tags", ["tag_id"], { indexName: "index_scene_markers_tags_on_tag_id" });
  }
}

export const Database = new DatabaseImpl();
