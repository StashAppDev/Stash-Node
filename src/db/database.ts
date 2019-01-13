import Knex from "knex";
import { Model } from "objection";
import path from "path";
import { log } from "../logger";
import { StashPaths } from "../stash/paths.stash";
import { StashMigrationSource } from "./migration-source";
import { Gallery } from "./models/gallery.model";
import { Performer } from "./models/performer.model";
import { SceneMarker } from "./models/scene-marker.model";
import { Scene } from "./models/scene.model";
import { ScrapedItem } from "./models/scraped-item.model";
import { Studio } from "./models/studio.model";
import { Tag } from "./models/tag.model";

class DatabaseImpl {
  public knex: Knex;

  public async initialize() {
    // Knex
    const config: Knex.Config = {
      client: "sqlite3",
      connection: {
        filename: StashPaths.databaseFile,
      },
      migrations: {
        // directory: path.join(__dirname, "../db/migrations"),
        migrationSource: new StashMigrationSource(),
      } as any, // TODO: Knex typings is missing this config option.
      pool: {
        afterCreate: (conn: any, cb: any) => {
          conn.run("PRAGMA foreign_keys = ON", cb);
        },
      },
      useNullAsDefault: true,
    };
    this.knex = Knex(config);
    await this.knex.migrate.latest();
    Model.knex(this.knex);

    // Prime the table metadata for each model
    await Gallery.fetchTableMetadata();
    await Performer.fetchTableMetadata();
    await SceneMarker.fetchTableMetadata();
    await Scene.fetchTableMetadata();
    await ScrapedItem.fetchTableMetadata();
    await Studio.fetchTableMetadata();
    await Tag.fetchTableMetadata();
  }

  public async reset() {
    await this.knex.raw("PRAGMA foreign_keys = OFF;");
    await this.knex.schema
      .dropTableIfExists("galleries")
      .dropTableIfExists("performers")
      .dropTableIfExists("scene_markers")
      .dropTableIfExists("scenes")
      .dropTableIfExists("scraped_items")
      .dropTableIfExists("studios")
      .dropTableIfExists("tags")
      .dropTableIfExists("performers_scenes")
      .dropTableIfExists("scene_markers_tags")
      .dropTableIfExists("scenes_tags")
      .dropTableIfExists("knex_migrations")
      .dropTableIfExists("knex_migations_lock");
    await this.knex.raw("PRAGMA foreign_keys = ON;");

    await this.knex.migrate.latest();

    log.info("Database reset!");
  }

  public async shutdown() {
    await this.knex.destroy();
  }
}

export const Database = new DatabaseImpl();
